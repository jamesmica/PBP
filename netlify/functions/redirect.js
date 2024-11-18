exports.handler = async (event, context) => {
    // URL de destination sans paramètres
    const redirectTo = "https://www.ithea-conseil.fr/bonnes-pratiques/";

    return {
        statusCode: 301,
        headers: {
            Location: redirectTo
        }
    };
};
