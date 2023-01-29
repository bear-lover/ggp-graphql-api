import HomeCommonType from '../../types/Home/HomeCommonType';
import { Banner } from '../../models';

const getHomeData = {

  type: HomeCommonType,
  
 async resolve({}) {
    try {
      let result = await Banner.findOne();
      return {
        result
      };
    } catch (error) {}
  }
};

export default getHomeData;

/**
 {
  getHomeData {
    result {
      id
      title
      content
      isEnable
      getHomeBanner {
        id
        name
        enable
      }
      getImageBanner {
        id
        title
        description
        buttonLabel
        image
      }
      getPopularLocationAdmin {
        id
        location
        locationAddress
        image
        isEnable
        createdAt
        updatedAt
      }
      getStaticInfo {
        title
        content
        name
        image
        isEnable
      }
      getRecommend {
        id
        title
        beds
        bookingType
        coverPhoto
        reviewsCount
        reviewsStarRating
        listPhotos {
          id
          name
          type
          status
        }
        user {
          id
          userBanStatus
        }
        listingData {
          basePrice
          currency
        }
        settingsData {
          listsettings {
            id
            itemName
          }
        }
        wishListStatus
        isListOwner
      }
      getMostViewedListing {
        id
        title
        beds
        bookingType
        coverPhoto
        reviewsCount
        reviewsStarRating
        listPhotos {
          id
          name
          type
          status
        }
        user {
          id
          userBanStatus
        }
        listingData {
          basePrice
          currency
        }
        settingsData {
          listsettings {
            id
            itemName
          }
        }
        wishListStatus
        isListOwner
      }
    }
  }
}
 */