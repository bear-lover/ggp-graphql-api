import dotenv from 'dotenv';
dotenv.config();

/* eslint-disable max-len */
export const port = process.env.PORT || 4000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
export const url = process.env.SITE_URL; /* From ENV */
export const sitename = process.env.SITENAME;
export const environment = process.env.environment || 'DEV'; // DEV or STAGING or PROD
export const websiteUrl = process.env.WEBSITE_URL;

export const locales = ['en-US', 'es', 'it-IT', 'fr-FR', 'pt-PT', 'ar', 'he'];


export const databaseConfig = { /* From ENV */
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DBNAME,
  host: process.env.DATABASE_HOST,
  dialect: process.env.DATABASE_DIALECT || "mysql"
}

export const auth = {
  jwt: { secret: process.env.JWT_SECRET }
};

export const googleMapAPI = '<Your API Key>';
export const googleMapServerAPI = process.env.GOOGLE_MAP_SERVER_API;


export const payment = { /* From ENV */
  stripe: {
    secretKey: process.env.STRIPE_SECRET,
  },

  paypal: {
    returnURL: `${url}${process.env.PAYPAL_RETURN_URL}`,
    cancelURL: `${url}${process.env.PAYPAL_CANCEL_URL}`,
  },

};


