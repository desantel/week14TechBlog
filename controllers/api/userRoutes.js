const router = require('express').Router();
const { User } = require('../../models');

router.post('./login', async (req,res) => {
    try {
        //checking userdata
        const userData = await User.findOne({ where: { email: req.body.email } });
         if (!userData) {
             res
                .status(400)
                .json({ message: 'Incorrect username or password' });
            return;
         }

         //verify password with email
         const validPassword = await userData.checkPassword(req.body.password);

         if (!validPassword) {
            res
                .status(400)
                .json({ message: 'Incorrect username or password' });
            return;
         }

         //creates session for logged in users
         req.session.save(() => {
             req.session.user_id = userData.id;
             req.session.logged_in = true;

             res.json({ message: 'You are logged in' });
         });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/logout', (req,res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;