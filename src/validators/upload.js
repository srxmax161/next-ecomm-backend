export function validateImage(data){
    const validationErrors = {}
    if (!data.title || typeof data.title !== 'string') {
        validationErrors.title = 'Title is required'
    }

    // if(!data.file || typeof data.file !== 'string'){
    //     validationErrors.file = 'Image is required'
    // }
    
    return validationErrors
}