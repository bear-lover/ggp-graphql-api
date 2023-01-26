import { ImageBanner } from '../../models';
import ImageBannerCommonType from '../../types/siteadmin/ImageBannerCommonType';

const getImageBanner = {

    type: ImageBannerCommonType,

    async resolve({ request }) {
        try {

            const result = await ImageBanner.findOne();

            return await {
                status: result ? 200 : 400,
                errorMessage: result ? null : 'Oops! Unable to find. Try again.',
                result
            };

        } catch (error) {
            return {
                status: 400,
                errorMessage: 'Oops! Something went wrong.' + error

            }
        }
    }
};

export default getImageBanner;

/*

{
    getImageBanner {
        id
        title
        description
        buttonLabel
        image
    }
}

*/
