'use strict'

// const imageAsDataURL = (imageBlob) => {
//     const fileReader = new FileReader();
//     fileReader.readAsDataURL(imageBlob);

//     return new Promise((resolve, reject) =>{
//         fileReader.addEventListener('load', ()=> {
//             resolve(fileReader.result);
//         });
//         fileReader.addEventListener('error', () =>{
//             reject(fileReader.error);
//         });
//     });
// }

const imageAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);  // Convert the file to a Data URL (base64)
    });
}

export default imageAsDataURL;