const mailerOption = (from,to, subject, htmlToSend) => {
    const mailerOption = {
        from: from,
        to,
        subject,
        html: htmlToSend,

    }
    return mailerOption;
};

module.exports = mailerOption;