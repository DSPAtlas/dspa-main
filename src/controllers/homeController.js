import HomeModel from '../models/homeModel.js';

class HomeController {
    static getHomePage(req, res) {
        const data = HomeModel.getHomePageData();
        res.render('home', data);
    }
    static handleSearch(req, res) {
        const { taxonomyID, proteinName } = req.query;// Assuming the search term comes from a form submission

        // Redirect to the ProteinModel route with the search term as a query parameter
        res.redirect(`/api/v1/proteins?taxonomyID=${encodeURIComponent(taxonomyID)}&proteinName=${encodeURIComponent(proteinName)}`);
    }
}

export default HomeController;