import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import me from './queries/me';
import news from './queries/news';
import intl from './queries/intl';
// Users
import validateEmailExist from './queries/Users/validateEmailExist';
import createUser from './mutations/Users/createUser';
import userLogin from './queries/Users/userLogin';
import testToken from './mutations/Users/testToken';
import userLogout from './mutations/Users/userLogout';
import userRegister from './queries/userRegister';
import userAccount from './queries/Users/userAccount';
import userEditProfile from './queries/userEditProfile';
import userUpdate from './mutations/Users/userUpdate';
import userForgotPassword from './mutations/Users/userForgotPassword';
import verifyForgotPassword from './queries/Users/verifyForgotPassword';
import updateForgotPassword from './mutations/Users/updateForgotPassword';
import userUpdateCommon from './mutations/Users/userUpdateCommon';
import getUserBanStatus from './queries/Users/getUserBanStatus';
import createListing from './mutations/CreateListing/createListing';
import updateListing from './queries/updateListing';
import updateListingStep2 from './mutations/CreateListing/updateListingStep2';
import updateListingStep3 from './mutations/CreateListing/updateListingStep3';
import updateListingStep4 from './queries/updateListingStep4'
import managePublishStatus from './mutations/CreateListing/managePublishStatus';
import managePublish from './mutations/Listing/ManagePublish';
import deleteUser from './mutations/Users/deleteUser';

//Listing
import getListingSettings from './queries/ListSettings/getListingSettings';
import getListingSettingsCommon from './queries/ListSettings/getListingSettingsCommon';
import userSocialLogin from './queries/Users/userSocialLogin';
import getMostViewedListing from './queries/Listing/getMostViewedListing';
import getRecommend from './queries/Listing/getRecommend';
import ChangePassword from './queries/ChangePassword';
import getUserVerifiedInfo from './queries/getUserVerifiedInfo';
import updateUserVerifiedInfo from './queries/updateUserVerifiedInfo';
import UploadProfilePicture from './queries/UploadProfilePicture';
import RemoveProfilePicture from './queries/RemoveProfilePicture';
import viewListing from './queries/Listing/viewListing';
import getListingDetails from './queries/Listing/getListingDetails';
import getSimilarListing from './queries/Listing/getSimilarListing';
import getReviews from './queries/Listing/getReviews';
import SearchListing from './queries/Search/SearchListing';
import getSearchSettings from './queries/Search/getSearchSettings';
import cancelReservationData from './queries/Reservation/cancelReservationData';
import getPopularLocations from './queries/Listing/getPopularLocations';

import getListingCalendars from './queries/Listing/getListingCalendars';
import deleteCalendar from './mutations/Listing/DeleteImportCalendar';
import getBlockedDates from './queries/Listing/getBlockedDates';
import blockImportedDates from './mutations/Listing/BlockImportedDates';
import dateAvailability from './queries/Listing/dateAvailability';

// List Photos
import CreateListPhotos from './mutations/CreateListing/CreateListPhotos';
//import RemoveListPhotos from './mutations/CreateListing/RemoveListPhotos';
import ShowListPhotos from './queries/ShowListPhotos';




//Reservation
import getAllReservation from './queries/Reservation/getAllReservation';

// Common
import userLanguages from './queries/Common/userLanguages';

// Billing Calculation
import getBillingCalculation from './queries/BillingCalculation/getBillingCalculation';
// Currency 
import getCurrencies from './queries/Currencies/getCurrencies';
import Currency from './queries/Currencies/Currency';
import StoreCurrencyRates from './queries/StoreCurrencyRates';
import DateAvailability from './queries/DateAvailability';
import getListingSpecSettings from './queries/getListingSpecSettings';
import GetAddressComponents from './queries/GetAddressComponents';
import getDateAvailability from './queries/ContactHost/getDateAvailability';
import CreateEnquiry from './mutations/ContactHost/CreateEnquiry';
import getBaseCurrency from './queries/getBaseCurrency';
import managePaymentCurrency from './mutations/Currency/managePaymentCurrency'


// Reservation Details
import getReservation from './queries/Reservation/getReservation';
import getAllReservationAdmin from './queries/Reservation/getAllReservationAdmin';
import checkReservation from './queries/Reservation/checkReservation';
import getPayoutStatus from './queries/Reservation/getPayoutStatus';
import updateReservation from './mutations/Reservation/updateReservation';
import getPaymentData from './queries/Reservation/getPaymentData';


// SiteSettings
import siteSettings from './queries/siteAdmin/siteSettings';
import getApplicationVersionInfo from './queries/siteAdmin/getApplicationVersionInfo';

// import getUnReadCount from './queries/UnReadCount/getUnReadCount';
// import getUnReadThreadCount from './queries/UnReadCount/getUnReadThreadCount';
import createReservation from './mutations/Payment/createReservation';
import confirmReservation from './mutations/Payment/confirmReservation';
import cancelReservation from './mutations/Payment/cancelReservation';
import getAllThreads from './queries/GetAllThreads/getAllThreads';
import getThreads from './queries/GetAllThreads/getThreads';
import getThread from './queries/getThread';
import showUserProfile from './queries/showUserProfile';
import viewReservationAdmin from './queries/Reservation/viewReservationAdmin'
// import getUnreadThreads from './queries/getUnreadThreads';
import getUnreadCount from './queries/getUnreadCount';
import getAllThreadItems from './queries/Messages/getAllThreadItems';


import userReviews from './queries/Reviews/userReviews';

import createReportUser from './mutations/ReportUser/createReportUser';

import sendMessage from './mutations/Message/SendMessage';
import readMessage from './mutations/Message/ReadMessage';

import CreateWishListGroup from './mutations/WishList/CreateWishListGroup';
import CreateWishList from './mutations/WishList/CreateWishList';
import UpdateWishListGroup from './mutations/WishList/UpdateWishListGroup';
import DeleteWishListGroup from './mutations/WishList/DeleteWishListGroup';
import getAllWishListGroup from './queries/WishList/getAllWishListGroup';
import getWishListGroup from './queries/WishList/getWishListGroup';
import contactSupport from './queries/ContactSupport/contactSupport';
import getCountries from './queries/Countries/getCountries';
import getBanner from './queries/getBanner';
import EmailVerification from './mutations/EmailVerification/EmailVerification';
import getHomeBanner from './queries/getHomeBanner';

// Transaction History
import getTransactionHistory from './queries/TransactionHistory/getTransactionHistory';
import updatePayoutForReservation from './mutations/TransactionHistory/updatePayoutForReservation';

// Message System
import CreateThreadItems from './mutations/CreateThreadItems';


// Sms Verification
import getPhoneData from './queries/SmsVerification/getPhoneData';
import AddPhoneNumber from './mutations/SmsVerification/AddPhoneNumber';
import RemovePhoneNumber from './mutations/SmsVerification/RemovePhoneNumber';
import VerifyPhoneNumber from './mutations/SmsVerification/VerifyPhoneNumber';

// WhishList
import getAllWishList from './queries/WishList/getAllWishList';
import ResendConfirmEmail from './queries/Users/ResendConfirmEmail';
import sendForgotPassword from './mutations/ForgotPassword/SendForgotPassword';
import forgotPasswordVerification from './queries/ForgotPassword/ForgotPasswordVerification';
import changeForgotPassword from './mutations/ForgotPassword/ChangeForgotPassword';


// Social Verification
import SocialVerification from './mutations/Users/SocialVerification';

// Create Listing
// import createListing from './mutations/CreateListing/createListing';
import locationItem from './queries/locationItem';
import showListing from './queries/showListing';
import showListingSteps from './queries/Listing/showListingSteps';
import ManageListingSteps from './mutations/CreateListing/ManageListingSteps';
import showListPhotosL from './queries/Listing/showListPhotos';
import getPayouts from './queries/Payout/getPayouts';
import ManageListings from './queries/Listing/ManageListings';
import RemoveListPhotos from './mutations/CreateListing/RemoveListPhotos';
import UserListing from './queries/UserListing';
import getListMeta from './queries/Listing/getListMeta';

import getProfile from './queries/UserProfile';


// Payout
import getPaymentMethods from './queries/Payout/getPaymentMethods';
import setDefaultPayout from './mutations/Payout/setDefaultPayout';
import addPayout from './mutations/Payout/addPayout';
import removePayout from './mutations/Payout/removePayout';

import RemoveMultiPhotos from './mutations/CreateListing/RemoveMultiPhotos';
import verifyPayout from './mutations/Payout/verifyPayout'
import confirmPayout from './mutations/Payout/confirmPayout'

// Remove Listing
import RemoveListing from './mutations/CreateListing/RemoveListing';

// Update List Blocked
import UpdateListBlockedDates from './mutations/CreateListing/UpdateListBlockedDates';

// Get BlockedDates
import getListBlockedDates from './queries/Listing/getListBlockedDates';

// Reservation Status
import ReservationStatus from './mutations/Message/ReservationStatus';
import getItinerary from './queries/Reservation/getItinerary';
import getListReservation from './queries/Reservation/getListReservation';


// Cancell Reservation
import CancelReservation from './mutations/Cancel/CancelReservation';

// User Feedback Email
import userFeedback from './mutations/userFeedback';
import UpdateSpecialPrice from './mutations/CreateListing/UpdateSpecialPrice';
import getListingSpecialPrice from './queries/Listing/getListingSpecialPrice';

// Mobile active social Logins
import getActiveSocialLogins from './queries/Common/getActiveSocialLogins';

// Reviews
import getPropertyReviews from './queries/Reviews/getPropertyReviews';
import getUserReviews from './queries/Reviews/getUserReviews';
import getPendingUserReviews from './queries/Reviews/getPendingUserReviews';
import getPendingUserReview from './queries/Reviews/getPendingUserReview';
import writeUserReview from './mutations/Reviews/writeUserReview';

// Payment Settings - For now, it's PayPal
import getPaymentInfo from './queries/getPaymentInfo';


// StripeKey
import getPaymentSettings from './queries/siteAdmin/getPaymentSettings';
import confirmPayPalExecute from './mutations/Payment/confirmPayPalExecute';

import submitForVerification from './mutations/CreateListing/submitForVerification';

import getImageBanner from './queries/siteAdmin/getImageBanner';
import GetListViews from './queries/GetListViews';
import GetMostViewedListingL from './queries/GetMostViewedListing';
import UpdateListViews from './queries/UpdateListViews';

import getStaticPageContent from './queries/StaticPage/getStaticPageContent';
import getWhyHostData from './queries/siteAdmin/getWhyHostData';

// Listing Management
import addRecommend from './mutations/SiteAdmin/ListingManagement/addRecommend';
import removeRecommend from './mutations/SiteAdmin/ListingManagement/removeRecommend';
import adminRemoveListing from './mutations/SiteAdmin/ListingManagement/adminRemoveListing';

// Currency Management
import currencyManagement from './mutations/SiteAdmin/CurrencyManagement/currencyManagement';
import baseCurrency from './mutations/SiteAdmin/CurrencyManagement/baseCurrency';

// Logo
import uploadLogo from './mutations/SiteAdmin/Logo/uploadLogo';
import removeLogo from './mutations/SiteAdmin/Logo/removeLogo';
import getLogo from './queries/siteadmin/getLogo';
// Location
import uploadLocation from './mutations/SiteAdmin/PopularLocation/uploadLocation';
import removeLocation from './mutations/SiteAdmin/PopularLocation/removeLocation';

import adminUserLogin from './queries/siteadmin/adminUserLogin';
import changeAdminUser from './mutations/SiteAdmin/changeAdminUser';

import userManagement from './queries/siteadmin/userManagement';
import editUser from './queries/siteadmin/editUser';
import updateUser from './queries/siteadmin/updateUser';
import updateSiteSettings from './queries/siteadmin/updateSiteSettings';
import getAdminListingSettings from './queries/siteadmin/getAdminListingSettings';

import addListSettings from './queries/siteadmin/addListSettings';
import updateListSettings from './queries/siteadmin/updateListSettings';
import deleteListSettings from './queries/siteadmin/deleteListSettings';
import getListSettings from './queries/siteadmin/getListSettings'

import getAllListings from './queries/siteadmin/getAllListings';
import updatePaymentSettings from './queries/siteadmin/updatePaymentSettings';
import updateSearchSettings from './queries/siteadmin/updateSearchSettings';
import updateBannerSettings from './queries/siteadmin/updateBannerSettings';

import getUserDashboard from './queries/siteadmin/getUserDashboard';
import getListingDashboard from './queries/siteadmin/getListingDashboard';
import updateImageBanner from './queries/siteadmin/updateImageBanner';
import uploadImageBanner from './queries/siteadmin/uploadImageBanner';

import removeImageBanner from './queries/siteadmin/removeImageBanner';
import getReservationDashboard from './queries/siteadmin/getReservationDashboard';
import messageManagement from './queries/siteadmin/messageManagement';
import reviewsManagement from './queries/siteadmin/reviewsManagement';
import reportUserManagement from './queries/siteadmin/reportUserManagement';


import getPopularLocation from './queries/siteadmin/getPopularLocation';
import editPopularLocation from './queries/siteadmin/editPopularLocation';
import deletePopularLocation from './mutations/SiteAdmin/deletePopularLocation';
import updatePopularLocation from './mutations/SiteAdmin/updatePopularLocation';
import updatePopularLocationStatus from './mutations/SiteAdmin/updatePopularLocationStatus';
import addPopularLocation from './mutations/SiteAdmin/addPopularLocation';
import deleteHomeBanner from './mutations/SiteAdmin/deleteHomeBanner';

// Service Fees
import updateServiceFees from './mutations/ServiceFees/updateServiceFees';
import getServiceFees from './queries/ServiceFees/getServiceFees';

// Cancellation
import getAllCancellation from './queries/Cancellation/getAllCancellation';
import getSpecificCancellation from './queries/Cancellation/getSpecificCancellation';

// Reviews
import pendingReviews from './queries/Reviews/pendingReviews';
import writeReview from './mutations/Reviews/writeReview';
import writeReviewData from './queries/Reviews/writeReviewData';
import moreListReviews from './queries/Reviews/moreListReviews';
import writeAdminReview from './mutations/SiteAdmin/AdminReview/writeAdminReview';
import getAdminReviews from './queries/siteadmin/getAdminReviews';
import deleteAdminReview from './mutations/SiteAdmin/AdminReview/deleteAdminReview';
import editAdminReview from './queries/siteadmin/editAdminReview';

//document 
import uploadDocument from './mutations/Document/uploadDocument';
import CreateDocumentList from './mutations/DocumentList/CreateDocumentList';
import RemoveDocumentList from './mutations/DocumentList/RemoveDocumentList';
import ShowDocumentList from './queries/DocumentList/ShowDocumentList';
import getAllDocument from './queries/siteadmin/Document/getAllDocument';
import showAllDocument from './queries/siteadmin/Document/showAllDocument';
import DocumentManagement from './mutations/SiteAdmin/DocumentVerification/DocumentManagement';

// Wish List
import CreateWishLists from './mutations/WishList/CreateWishLists';


import CreateFooterSetting from './mutations/SiteAdmin/FooterBlock/CreateFooterSetting';

import getFooterSetting from './queries/siteadmin/getFooterSetting';
import getAllMessageHistory from './queries/siteadmin/getAllMessageHistory';
import getAllPaymentMethods from './queries/siteadmin/getAllPaymentMethods';

import CreateReportUser from './mutations/ReportUser/CreateReportUser';


// Similar Listings
import getAllReport from './queries/siteadmin/ReportUser/getAllReport';

// SMS Verification
import updateListStatus from './mutations/WishList/updateListStatus';
import getUserStatus from './queries/getUserStatus';

// Update user ban

import updateBanServiceHistoryStatus from './mutations/SiteAdmin/updateBanServiceHistoryStatus';

//View profile
import ManageListingsProfile from './queries/ViewProfile/ManageListingsProfile';

// Transaction 
import ManageListingTransaction from './queries/ManageListing/ManageListingTransaction';

// Popular Location 
import getPopularLocationAdmin from './queries/siteadmin/getPopularLocationAdmin';

// Day Drag Calendar
import ListingDataUpdate from './mutations/Listing/ListingDataUpdate';
import UpdateBlockedDates from './mutations/Listing/UpdateBlockedDates';
import getListAvailableDates from './queries/Listing/getListAvailableDates';
import getSpecialPricing from './queries/Listing/getSpecialPricing';
import getUpcomingBookings from './queries/getUpcomingBookings'
import getCheckUserStatus from './queries/getCheckUserStatus';
import getStepTwo from './queries/Listing/getStepTwo';
import getAdminUserStatus from './queries/getAdminUserStatus';

//blog
import getBlogDetails from './queries/getBlogDetails';
import getBlogHome from './queries/siteadmin/getBlogHome';
import getEnabledBlog from './queries/siteadmin/getEnabledBlog';
import editBlogDetails from './queries/siteadmin/editBlogDetails';
import deleteBlogDetails from './mutations/SiteAdmin/deleteBlogDetails';
import addBlogDetails from './mutations/SiteAdmin/addBlogDetails';
import updateBlogDetails from './mutations/SiteAdmin/updateBlogDetails';
import updateBlogStatus from './mutations/SiteAdmin/updateBlogStatus';
import updatePaymentGatewayStatus from './mutations/SiteAdmin/updatePaymentGatewayStatus';


import getEditStaticPage from './queries/siteadmin/getEditStaticPage';
import updateStaticPage from './mutations/SiteAdmin/updateStaticPage';


// SiteAdmin Reviews
import getReviewsDetails from './queries/siteadmin/Reviews/getReviewsDetails';
import editUserReviews from './queries/siteadmin/Reviews/editUserReviews';

import getWhyHostAllReviews from './queries/siteadmin/WhyHostReview/getWhyHostAllReviews';
import getWhyHostReview from './queries/siteadmin/WhyHostReview/getWhyHostReview';
import deleteWhyHostReview from './mutations/SiteAdmin/WhyHostReview/deleteWhyHostReview';
import updateWhyHostReview from './mutations/SiteAdmin/WhyHostReview/updateWhyHostReview';
import getHomeWhyHostReview from './queries/siteadmin/WhyHostReview/getHomeWhyHostReview';

import updateReview from './mutations/SiteAdmin/userReview/updateReview';


// Home page logo
import getHomeLogo from './queries/siteadmin/getHomeLogo';
import uploadHomeLogo from './mutations/SiteAdmin/Logo/uploadHomeLogo';
import removeHomeLogo from './mutations/SiteAdmin/Logo/removeHomeLogo';
import getEmailLogo from './queries/siteadmin/getEmailLogo';
import uploadEmailLogo from './mutations/SiteAdmin/Logo/uploadEmailLogo';
import removeEmailLogo from './mutations/SiteAdmin/Logo/removeEmailLogo';

import addHomeBanner from './mutations/SiteAdmin/addHomeBanner';
import updateStaticBlockSettings from './mutations/SiteAdmin/updateStaticBlockSettings';
import getStaticInfo from './queries/siteadmin/getStaticInfo';
import uploadStaticBlock from './mutations/SiteAdmin/uploadStaticBlock'
import removeStaticImages from './mutations/SiteAdmin/removeStaticImages';


//remove special pricing or blocked dates
import RemoveBlockedDates from './mutations/Listing/RemoveBlockedDates';

// Admin Roles
import createAdminRole from './mutations/SiteAdmin/AdminRoles/createAdminRole';
import getAllAdminRoles from './queries/siteadmin/AdminRoles/getAllAdminRoles';
import deleteAdminRole from './mutations/SiteAdmin/AdminRoles/deleteAdminRole';

// Admin Users
import getAllAdminUsers from './queries/siteadmin/AdminUser/getAllAdminUsers';
import createAdminUser from './mutations/SiteAdmin/AdminUser/createAdminUser';
import deleteAdminUser from './mutations/SiteAdmin/AdminUser/deleteAdminUser';
import getAdminUser from './queries/siteadmin/AdminUser/getAdminUser';


//WhyHostInfoBlock
import getWhyHostPage from './queries/siteadmin/getWhyHostPage';
import updateWhyHostPage from './mutations/SiteAdmin/updateWhyHostPage'

import sendContactEmail from './mutations/sendContactEmail';

import updatePayoutStatus from './mutations/AutoPayout/updatePayoutStatus';
import getAllPayoutReservation from './queries/AutoPayout/getAllPayoutReservation';
import getFailedTransaction from './queries/AutoPayout/getFailedTransaction';

import adminUserLogout from './queries/siteadmin/adminUserLogout';
import removeWhyHostImages from './mutations/SiteAdmin/removeWhyHostImages';

import checkListing from './queries/checkListing';
import getAllAdminListSettings from './queries/siteadmin/getAllAdminListSettings';
import getSideMenu from './queries/siteadmin/getSideMenu';
import updateSideMenu from './mutations/SiteAdmin/updateSideMenu';

import approveListing from './mutations/Listing/approveListing';
import getAllPermissionListings from './queries/siteadmin/getAllPermissionListings';
import createListingHistory from './mutations/Listing/createListingHistory';


// Site settings image value update
import updateSiteSettingsLogo from './mutations/SiteAdmin/Logo/updateSiteSettingsLogo';
import getSiteSettingsLogo from './queries/siteadmin/getSiteSettingsLogo';
import getConfigSettings from './queries/siteadmin/getConfigSettings';

import removeFavIconLogo from './mutations/SiteAdmin/Logo/removeFavIconLogo';

import getHomeData from './queries/Home/getHomeData';

import updateWhyHost from './mutations/SiteAdmin/updateWhyHost';

import getCancelPolicies from './queries/siteadmin/CancellationPolicy/getCancelPolicies';
import getCancelPolicy from './queries/siteadmin/CancellationPolicy/getCancelPolicy';
import updateCancelPolicy from './mutations/SiteAdmin/CancellationPolicy/updateCancelPolicy';

import updateConfigSettings from './mutations/SiteAdmin/updateConfigSettings';


const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      validateEmailExist,
      userLogin,
      userAccount,
      userLanguages,
      verifyForgotPassword,
      getListingSettings,
      userSocialLogin,
      getMostViewedListing,
      getRecommend,
      viewListing,
      getListingDetails,
      getSimilarListing,
      getReviews,
      SearchListing,
      dateAvailability,
      getListingSettingsCommon,
      getAllReservation,
      getBillingCalculation,
      getCurrencies,
      Currency,
      siteSettings,
      getSearchSettings,
      getDateAvailability,
      getReservation,
      // getUnReadCount,
      // getUnReadThreadCount,
      getAllThreads,
      getThreads,
      showUserProfile,
      userReviews,
      cancelReservationData,
      getUserBanStatus,
      getAllWishListGroup,
      getWishListGroup,
      contactSupport,
      getCountries,
      getPhoneData,
      getAllWishList,
      ResendConfirmEmail,
      locationItem,
      showListingSteps,
      ShowListPhotos,
      getPayouts,
      ManageListings,
      getPaymentMethods,
      getListBlockedDates,
      getListingSpecialPrice,
      getActiveSocialLogins,
      getPropertyReviews,
      getUserReviews,
      getPendingUserReviews,
      getPendingUserReview,
      getPaymentSettings,
      getImageBanner,
      getStaticPageContent,
      getWhyHostData,
      getPopularLocations,
      getApplicationVersionInfo,

      me,
      news,
      intl,
      userRegister,
      userEditProfile,
      updateListing,
      updateListingStep4,
      ChangePassword,
      getUserVerifiedInfo,
      updateUserVerifiedInfo,
      UploadProfilePicture,
      RemoveProfilePicture,
      getListingCalendars,
      getBlockedDates,
      showListPhotosL,
      StoreCurrencyRates,
      // DateAvailability,  DUPLIACTE
      getListingSpecSettings,
      GetAddressComponents,
      getBaseCurrency,
      getAllReservationAdmin,
      checkReservation,
      getPayoutStatus,
      getPaymentData,
      getThread,
      viewReservationAdmin,
      // getUnreadThreads,
      getUnreadCount,
      getAllThreadItems,
      getBanner,
      getHomeBanner,
      getTransactionHistory,
      forgotPasswordVerification,
      showListing,
      UserListing,
      getListMeta,
      getProfile,
      getItinerary,
      getListReservation,
      getPaymentInfo,
      GetListViews,
      GetMostViewedListingL,
      UpdateListViews,
      getLogo,
      adminUserLogin,
      userManagement,
      editUser,
      updateSiteSettings,
      getAdminListingSettings,
      addListSettings,
      updateListSettings,
      deleteListSettings,
      getListSettings,
      getAllListings,
      updatePaymentSettings,
      updateSearchSettings,
      updateBannerSettings,
      getUserDashboard,
      getListingDashboard,
      updateImageBanner,
      uploadImageBanner,

      removeImageBanner,
      getReservationDashboard,
      messageManagement,
      reviewsManagement,
      reportUserManagement,
      getPopularLocation,

      editPopularLocation,
      getServiceFees,
      getAllCancellation,
      getSpecificCancellation,
      getAllCancellation,
      getSpecificCancellation,
      pendingReviews,
      writeReviewData,
      moreListReviews,
      getAdminReviews,
      editAdminReview,
      ShowDocumentList,
      getAllDocument,
      showAllDocument,
      getFooterSetting,
      getAllMessageHistory,
      getAllPaymentMethods,
      getAllReport,
      getUserStatus,
      ManageListingsProfile,

      ManageListingTransaction,
      getPopularLocationAdmin,
      getListAvailableDates,
      getSpecialPricing,
      getUpcomingBookings,
      getCheckUserStatus,
      getStepTwo,
      getAdminUserStatus,
      getBlogDetails,
      getBlogHome,
      getEnabledBlog,
      editBlogDetails,
      getEditStaticPage,
      getReviewsDetails,
      editUserReviews,

      getWhyHostAllReviews,
      getWhyHostReview,
      getHomeWhyHostReview,
      getHomeLogo,
      getEmailLogo,
      getStaticInfo,
      getAllAdminUsers,
      getAdminUser,
      getWhyHostPage,
      getAllPayoutReservation,
      getFailedTransaction,
      adminUserLogout,
      checkListing,
      getAllAdminListSettings,
      getSideMenu,
      getAllPermissionListings,
      getSiteSettingsLogo,
      getConfigSettings,

      getHomeData,
      getCancelPolicies,
      getCancelPolicy,
    },
  }),
  mutation: new ObjectType({
    name: 'Mutation',
    fields: {
      createUser,
      testToken,
      userLogout,
      userUpdate,
      userForgotPassword,
      updateForgotPassword,
      CreateEnquiry,
      createReservation,
      confirmReservation,
      cancelReservation,
      sendMessage,
      readMessage,
      createReportUser,
      userUpdateCommon,
      CreateWishList,
      CreateWishListGroup,
      DeleteWishListGroup,
      UpdateWishListGroup,
      AddPhoneNumber,
      RemovePhoneNumber,
      EmailVerification,
      VerifyPhoneNumber,
      SocialVerification,
      createListing,
      updateListingStep2,
      ManageListingSteps,
      updateListingStep3,
      managePublishStatus,
      RemoveListPhotos,
      setDefaultPayout,
      addPayout,
      RemoveListing,
      RemoveMultiPhotos,
      UpdateListBlockedDates,
      ReservationStatus,
      CancelReservation,
      userFeedback,
      UpdateSpecialPrice,
      verifyPayout,
      confirmPayout,
      writeUserReview,
      confirmPayPalExecute,
      submitForVerification,

      deleteUser,
      managePublish,
      deleteCalendar,
      blockImportedDates,
      CreateListPhotos,
      managePaymentCurrency,
      updateReservation,
      updatePayoutForReservation,
      CreateThreadItems,
      sendForgotPassword,
      changeForgotPassword,
      removePayout,
      addRecommend,
      removeRecommend,
      adminRemoveListing,
      currencyManagement,
      baseCurrency,
      uploadLogo,
      removeLogo,
      uploadLocation,
      removeLocation,
      changeAdminUser,
      updateUser,
      deletePopularLocation,
      updatePopularLocation,
      updatePopularLocationStatus,
      addPopularLocation,
      deleteHomeBanner,
      updateServiceFees,
      writeReview,
      writeAdminReview,
      deleteAdminReview,
      uploadDocument,

      CreateDocumentList,
      RemoveDocumentList,
      DocumentManagement,
      CreateWishLists,
      CreateFooterSetting,
      CreateReportUser,
      updateListStatus,
      updateBanServiceHistoryStatus,
      ListingDataUpdate,
      UpdateBlockedDates,
      deleteBlogDetails,
      addBlogDetails,
      updateBlogDetails,
      updateBlogStatus,
      updatePaymentGatewayStatus,
      updateStaticPage,
      deleteWhyHostReview,
      updateWhyHostReview,
      updateReview,
      uploadHomeLogo,
      removeHomeLogo,
      uploadEmailLogo,
      removeEmailLogo,
      addHomeBanner,
      updateStaticBlockSettings,
      uploadStaticBlock,
      removeStaticImages,
      RemoveBlockedDates,
      createAdminRole,
      getAllAdminRoles,
      deleteAdminRole,
      createAdminUser,
      deleteAdminUser,
      updateWhyHostPage,
      sendContactEmail,
      updatePayoutStatus,
      removeWhyHostImages,
      updateSideMenu,
      approveListing,
      createListingHistory,
      updateSiteSettingsLogo,
      removeFavIconLogo,
      updateWhyHost,
      updateCancelPolicy,
      updateConfigSettings,
    }
  })
});

export default schema;
