module.exports = {

    checkSession: (req, res) => {
        if (req.session.authenticatedHash && req.session.loggedIn) {
            res.json({ loggedIn: true,
            authenticatedHash: req.session.authenticatedHash });
        } else {
            res.json({ loggedIn: false });
        }
    }
};