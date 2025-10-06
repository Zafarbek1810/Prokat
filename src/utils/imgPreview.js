
function getURlFile(imageHashId) {
    if(!file) return "";

    return (
        URL.createObjectURL(file)
    )
}

export default getURlFile;