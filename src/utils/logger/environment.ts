
export const isDevelopment = (): boolean => {
  return typeof process !== 'undefined' && 
         typeof process.env !== 'undefined' && 
         process.env.NODE_ENV === 'development';
};

export const isProduction = (): boolean => {
  return typeof process !== 'undefined' && 
         typeof process.env !== 'undefined' && 
         process.env.NODE_ENV === 'production';
};

