import { Model } from '~/models/index'

const MODEL_NAME = 'Category' // eslint-disable-line no-unused-vars
const COLL_NAME = 'categories' // eslint-disable-line no-unused-vars

/*
 * name        {string} - required, unique, index
 * description {string}
 * preference  {number} - required, default = 0
 */

export class Category extends Model {

}

Category.MODEL_NAME = MODEL_NAME
Category.COLL_NAME = COLL_NAME

export default Category
