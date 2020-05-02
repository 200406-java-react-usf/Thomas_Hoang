import { Brand } from '../models/Brands';

let id = 0;
export default[
    new Brand(id++, 'Better Homes & Gardens'),
    new Brand(id++, 'ScentSationals'),
    new Brand(id++, 'Mainstays'),
    new Brand(id++, 'WoodWick')
];