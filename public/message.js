

function formatMessage(name, message) {
    return {
        name,
        message,
        time: new Date()
    }
}


module.exports = formatMessage;