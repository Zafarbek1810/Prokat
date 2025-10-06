
function getURlFile(file) {
    if(!file) return "";

    return (
        URL.createObjectURL(file)
    )
}

export default getURlFile;