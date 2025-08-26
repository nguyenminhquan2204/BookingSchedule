import specialtyService from '../services/specialtyService';

let postCreateSpecialty = async (req, res) => {
   try {
      let response = await specialtyService.postCreateSpecialty(req.body);

      return res.status(200).json(response);
   } catch (error) {
      console.log(error);
      return res.status(200).json({
         errorCode: -1,
         errorMessage: 'Error from server!'
      })
   }
}

module.exports = {
   postCreateSpecialty: postCreateSpecialty
}