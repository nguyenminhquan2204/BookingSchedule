import db from "../models/index";

let postCreateSpecialty = (data) => {
   return new Promise(async (resolve, reject) => {
      try {
         if(!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown || !data.descriptionHTML) {
            resolve({
               errorCode: 1,
               errorMessage: 'Missing required parameter!'
            })

         } else {
            await db.Specialty.create({
               name: data.name,
               image: data.imageBase64,
               descriptionHTML: data.descriptionHTML,
               descriptionMarkdown: data.descriptionMarkdown
            })

            resolve({
               errorCode: 0,
               errorMessage: 'Create a new specialty successfully!'
            })
         }
      } catch (error) {
         reject(error);
      }
   })
}

module.exports = {
   postCreateSpecialty: postCreateSpecialty
}