const express = require('express');
const router = express.Router();
module.exports = router;

const database = require('../database/database');
const typedef = require('../typedef');
const Sort = typedef.sort;
const Filter_type = typedef.filter_type;

router.get('/', (req, res) => {
    res.redirect('/');
});

router.get('/:id', async (req, res) => {
    try {
        const sort_by = (req.query.sort_by) ? req.query.sort_by : Sort.price_asc;
        const per_page = (req.query.per_page) ? req.query.per_page : 30;
        const page = (req.query.page) ? req.query.page : 1;
        const filters = await database.get_filters_by_subcategory(req.params.id);

        let search_conds = [];
        // potrzebuję osobnego obiektu żeby zręcznie przechowywać dane
        let filter_state = {};

        for (const filter of filters) {
            if (filter.type === Filter_type.number) {
                const min = filter.name + '-min';
                if (req.query[min]) {
                    search_conds.push({ id: filter.id, value: req.query[min], type: Filter_type.number_min });                
                }
                filter_state[min] = req.query[min] || 0;

                const max = filter.name + '-max';
                if (req.query[max]) {
                    search_conds.push({ id: filter.id, value: req.query[max], type: Filter_type.number_min });                 
                }
                filter_state[max] = req.query[max] || 10000;

            } 
            else {
                if (req.query[filter.name]) {
                    if (!Array.isArray(req.query[filter.name])) {
                        search_conds.push({ id: filter.id, value: [req.query[filter.name]], type: Filter_type.other });
                        
                    } else {
                        search_conds.push({ id: filter.id, value: req.query[filter.name], type: Filter_type.other });
                    }                   
                }
                filter_state[filter.name] = req.query[filter.name] || [];
            }
        }
        const render_obj = {
            search: '',
            sort_by: sort_by,
            sort_opt: Sort,
            per_page: per_page,
            page: page,
            products: await database.get_product_by_subcategory(req.params.id, sort_by, per_page, page, req.query['price-min'], req.query['price-max'], req.query['producer'], search_conds),
            filters: filters,
            subcat_info: await database.get_position_of_subcategory(req.params.id),
            recommended: await database.get_recemended_products_in_subcategory(req.params.id),
            search_conds: search_conds,
            filter_state: filter_state,
            price_min: req.query['price-min'],
            price_max: req.query['price-max'],
            producer: req.query['producer']
        };
        res.render('products-list/products-list', render_obj);
    } catch (err) {
        req.session.error = err.message;
        res.redirect('/error');
    }
});