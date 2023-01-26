import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType
} from 'graphql';
import fetch from 'node-fetch';
import moment from 'moment';
import {
  Listing,
  SearchSettings,
  CurrencyRates
} from '../../../data/models';
import searchListingType from '../../types/searchListingType';
import sequelize from '../../sequelize';
import { googleMapAPI } from '../../../config';
import { convert } from '../../../helpers/currencyConvertion';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const SearchListing = {

  type: searchListingType,

  args: {
    personCapacity: { type: IntType },
    dates: { type: StringType },
    currentPage: { type: IntType },
    lat: { type: FloatType },
    lng: { type: FloatType },
    roomType: { type: new List(IntType) },
    bedrooms: { type: IntType },
    bathrooms: { type: IntType },
    beds: { type: IntType },
    amenities: { type: new List(IntType) },
    spaces: { type: new List(IntType) },
    houseRules: { type: new List(IntType) },
    priceRange: { type: new List(IntType) },
    geography: { type: StringType },
    bookingType: { type: StringType },
    geoType: { type: StringType },
    address: { type: StringType },
    currency: { type: StringType }
  },

  async resolve({ request }, {
    personCapacity,
    dates,
    currentPage,
    lat,
    lng,
    roomType,
    bedrooms,
    bathrooms,
    beds,
    amenities,
    spaces,
    houseRules,
    priceRange,
    geography,
    bookingType,
    geoType,
    address,
    currency
  }) {

    try {

      if (request && request.user) {
        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }
      }

      let limit = 10;
      let offset = 0;
      let attributesParam = ['id', 'title', 'personCapacity', 'lat', 'lng', 'beds', 'coverPhoto', 'bookingType', 'userId', 'reviewsCount'];
      let publishedStatus = {}, personCapacityFilter = {}, datesFilter = {}, countryFilter = {};
      let roomTypeFilter = {}, bedroomsFilter = {}, bathroomsFilter = {}, bedsFilter = {};
      let amenitiesFilter = {}, spacesFilter = {}, houseRulesFilter = {}, priceRangeFilter = {}, geographyFilter, mapBoundsFilter;
      let bookingTypeFilter = {}, rates, ratesData = {}, geographyData = {};
      let sw_lat, sw_lng, ne_lat, ne_lng, geoType, priceRangeCurrency, unAvailableFilter = {};
      let maximumNoticeFilter = {}, minNightsFilter = {}, maxNightsFilter = {};
      let rangeStart, rangeEnd;
      if (bookingType && bookingType === 'instant') {
        bookingTypeFilter = {
          bookingType
        }
      }

      // Offset from Current Page
      if (currentPage) offset = (currentPage - 1) * limit;

      // Search Price Settings
      const searchSettingsData = await SearchSettings.findOne({
        attributes: ['minPrice', 'maxPrice', 'PriceRangecurrency'],
        raw: true
      });
      priceRangeCurrency = searchSettingsData && searchSettingsData.priceRangeCurrency || 'USD';

      // Currency Rates
      const data = await CurrencyRates.findAll({
        attributes: ['currencyCode', 'rate', 'isBase'],
        raw: true
      });
      const base = data && data.find((o) => o && o.isBase).currencyCode || 'USD';
      data && data.length > 0 && data.map((o) => {
        ratesData[o.currencyCode] = o.rate;
      });
      rates = ratesData;

      if (address) {
        const URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURI(address) + '&key=' + googleMapAPI;
        let types = [], viewport;

        const geoCodeData = await new Promise((resolve, reject) => {
          fetch(URL, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'GET',
          }).then(res => res.json())
            .then(function (body) {
              if (body) {
                resolve(body)
              } else {
                reject(error)
              }
            });
        });

        if (geoCodeData && geoCodeData.results) {
          geoCodeData.results.map((value, key) => {
            viewport = value.geometry.viewport;
            types = value.types;
            sw_lat = viewport.southwest.lat;
            sw_lng = viewport.southwest.lng;
            ne_lat = viewport.northeast.lat;
            ne_lng = viewport.northeast.lng;
            lat = geoCodeData.results[0].geometry.location.lat;
            lng = geoCodeData.results[0].geometry.location.lng;

            value.address_components.map((item) => {
              if (item.types[0] == "administrative_area_level_1") {
                geographyData["administrative_area_level_1_short"] = item.short_name;
                geographyData["administrative_area_level_1_long"] = item.long_name;
              } else if (item.types[0] == "country") {
                geographyData[item.types[0]] = item.short_name;
              } else {
                geographyData[item.types[0]] = item.long_name;
              }

              if (types) {
                if (types.indexOf("country") > -1) {
                  geoType = "country";
                } else if (types.indexOf("administrative_area_level_1") > -1) {
                  geoType = "state";
                } else if (types.indexOf("administrative_area_level_2") > -1) {
                  geoType = "city";
                } else if (types.indexOf("street_address") > -1 || types.indexOf("route") > -1) {
                  geoType = "street";
                } else {
                  geoType = null;
                }
              }
            });
          });
        }
      }

      if (sw_lat && ne_lat && sw_lng && ne_lng) {
        mapBoundsFilter = {
          id: {
            $in: [
              sequelize.literal(`
                  SELECT
                      id
                  FROM
                      Listing
                  WHERE
                      (
                         lat BETWEEN ${sw_lat} AND ${ne_lat} 
                      ) AND (
                         lng BETWEEN ${sw_lng} AND ${ne_lng}
                      )
                `)
            ]
          }
        };
      }

      if (geoType) {
        let geographyConverted = geographyData;

        if (geoType === 'street') {
          geographyFilter = {
            $or: [
              {
                street: {
                  $like: '%' + geographyConverted.route + '%'
                },
                state: geographyConverted.administrative_area_level_1_short,
                country: geographyConverted.country
              },
              {
                street: {
                  $like: '%' + geographyConverted.route + '%'
                },
                state: {
                  $like: geographyConverted.administrative_area_level_1_long + '%'
                },
                country: geographyConverted.country
              }
            ]
          };
          countryFilter = {
            country: geographyConverted.country
          };
        } else if (geoType === 'state') {
          geographyFilter = {
            $or: [
              {
                state: geographyConverted.administrative_area_level_1_short,
                country: geographyConverted.country
              },
              {
                state: {
                  $like: geographyConverted.administrative_area_level_1_long + '%',
                },
                country: geographyConverted.country
              }
            ]
          };
          countryFilter = {
            country: geographyConverted.country
          };
        } else if (geoType === 'country') {
          countryFilter = {
            country: geographyConverted.country
          };
        }
      } else {
        if (lat && lng) {
          let distanceValue = 300;
          geographyFilter = {
            id: {
              $in: [
                sequelize.literal(`
                    SELECT
                        id
                    FROM
                        Listing
                    WHERE
                        (
                            6371 *
                            acos(
                                cos( radians( ${lat} ) ) *
                                cos( radians( lat ) ) *
                                cos(
                                    radians( lng ) - radians( ${lng} )
                                ) +
                                sin(radians( ${lat} )) *
                                sin(radians( lat ))
                            )
                        ) < ${distanceValue}
                  `)
              ]
            }
          };
        }
      }

      // Price Range
      rangeStart = priceRange != undefined && priceRange.length > 0 ? convert(base, rates, priceRange[0], priceRangeCurrency) : searchSettingsData.minPrice;
      rangeEnd = priceRange != undefined && priceRange.length > 0 ? convert(base, rates, priceRange[1], priceRangeCurrency) : searchSettingsData.maxPrice;

      priceRangeFilter = {
        id: {
          $in: [
            sequelize.literal(`SELECT listId FROM ListingData WHERE (basePrice / (SELECT rate FROM CurrencyRates WHERE currencyCode=currency limit 1)) BETWEEN ${rangeStart} AND ${rangeEnd}`)
          ]
        }
      };

      // Listing Unavailable
      unAvailableFilter = {
        id: {
          $notIn: [sequelize.literal(`SELECT listId FROM ListingData WHERE maxDaysNotice='unavailable'`)]
        }
      };

      // Bedrooms Filter
      if (bedrooms) bedroomsFilter = { bedrooms: { $gte: bedrooms } };

      // Bathrooms Filter
      if (bathrooms) bathroomsFilter = { bathrooms: { $gte: bathrooms } };

      // Beds Filter
      if (beds) bedsFilter = { beds: { $gte: beds } };

      // Person Capacity Filter
      if (personCapacity) personCapacityFilter = { personCapacity: { $gte: personCapacity } };

      // Room type Filter
      if (roomType && roomType.length > 0) {
        roomTypeFilter = {
          id: {
            $in: [
              sequelize.literal(`SELECT listId FROM UserListingData WHERE settingsId in(${roomType.toString()})`)
            ]
          }
        };
      }

      // Amenities Filter
      if (amenities && amenities.length > 0) {
        amenitiesFilter = {
          id: {
            $in: [
              sequelize.literal(`SELECT listId FROM UserAmenities WHERE amenitiesId in(${amenities.toString()}) GROUP BY listId`)
            ]
          }
        };
      }

      // Spaces Filter
      if (spaces && spaces.length > 0) {
        spacesFilter = {
          id: {
            $in: [
              sequelize.literal(`SELECT listId FROM UserSpaces WHERE spacesId in(${spaces.toString()}) GROUP BY listId`)
            ]
          }
        };
      }

      // House Rules Filter
      if (houseRules && houseRules.length > 0) {
        houseRulesFilter = {
          id: {
            $in: [
              sequelize.literal(`SELECT listId FROM UserHouseRules WHERE houseRulesId in(${houseRules.toString()}) GROUP BY listId`)
            ]
          }
        };
      }

      // Published Status
      publishedStatus = {
        isPublished: true
      };

      // Date Range Filter
      if (dates && dates !== "\\'\\' AND \\'\\'" && dates.toString().trim() !== "\\'\\' AND \\'\\'"
        && dates !== "'' AND ''" && data.toString().trim() !== "'' AND ''") {
        let checkIn = moment(dates.toString().split("AND")[0]), checkOut = moment(dates.toString().split("AND")[1]);
        let noticeFilter = [];
        [3, 6, 9, 12].map((value) => {
          let date = moment().add(value, 'months').format('YYYY-MM-DD');
          if (checkOut.isBetween(checkIn, date)) noticeFilter.push(`'${value}months'`);
        });

        let maxDaysNoticeFilter = noticeFilter.length > 0 ? `'available',${noticeFilter.toString()}` : `'available'`;

        // Maximum Notice Filter
        maximumNoticeFilter = {
          id: {
            $in: [
              sequelize.literal("SELECT listId FROM ListingData WHERE maxDaysNotice in (" + maxDaysNoticeFilter + ")")
            ]
          }
        };

        // Date Range Filter
        datesFilter = {
          id: {
            $notIn: [
              sequelize.literal("SELECT listId FROM ListBlockedDates WHERE blockedDates BETWEEN" + dates + " AND calendarStatus != 'available'")

            ]
          }
        };

        // Min Night Filter
        minNightsFilter = {
          id: {
            $in: [
              sequelize.literal(`SELECT listId FROM ListingData WHERE minNight = 0 OR minNight <= ${checkOut.diff(checkIn, 'days')}`)
            ]
          }
        };

        //Max Night Filter
        maxNightsFilter = {
          id: {
            $in: [
              sequelize.literal(`SELECT listId FROM ListingData WHERE maxNight = 0 OR maxNight >= ${checkOut.diff(checkIn, 'days')}`)
            ]
          }
        };
      }

      let where, filters = [
        bookingTypeFilter,
        publishedStatus,
        personCapacityFilter,
        datesFilter,
        roomTypeFilter,
        bedroomsFilter,
        bathroomsFilter,
        bedsFilter,
        amenitiesFilter,
        spacesFilter,
        houseRulesFilter,
        priceRangeFilter,
        unAvailableFilter,
        minNightsFilter,
        maxNightsFilter,
        maximumNoticeFilter,
        countryFilter //To prevent france country's Listing in the result, while searching for United Kingdom country
      ];

      if (mapBoundsFilter || geographyFilter) {
        where = {
          $or: [
            mapBoundsFilter || {},
            geographyFilter || {}
          ],
          $and: filters
        };
      } else {
        where = { $and: filters }
      }



      // SQL query for count
      const count = await Listing.count({ where });
      const results = await Listing.findAll({
        attributes: attributesParam,
        where,
        limit,
        offset,
        order: [['reviewsCount', 'DESC'], ['createdAt', 'DESC']],
      });

      return await {
        currentPage,
        count,
        results,
        status: (results && results.length > 0) ? 200 : 400,
        errorMessage: (results && results.length > 0) ? null : 'No records found!'
      }

    } catch (error) {
      return {
        errorMessage: 'Something went wrong' + error,
        status: 400
      };
    }
  },
};

export default SearchListing;
