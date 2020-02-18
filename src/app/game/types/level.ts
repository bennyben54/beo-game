import {Coord} from './coord';
import {Image} from './image';
import {Frame} from './frame';

export interface Level {
  platforms: Image[];
  decoration: Frame[];
  coins: Coord[];
  hero: Coord;
  spiders: Coord[];
  door: Coord;
  key: Coord;
}
 /* platforms: [
    {"image": "ground", "x": 0, "y": 546},
    {"image": "grass:8x1", "x": 0, "y": 420},
    {"image": "grass:2x1", "x": 420, "y": 336},
    {"image": "grass:1x1", "x": 588, "y": 504},
    {"image": "grass:8x1", "x": 672, "y": 378},
    {"image": "grass:4x1", "x": 126, "y": 252},
    {"image": "grass:6x1", "x": 462, "y": 168},
    {"image": "grass:2x1", "x": 798, "y": 84}
  ],
  "decoration": [
    {"frame": 0, "x": 84, "y": 504}, {"frame": 1, "x": 420, "y": 504},
    {"frame": 3, "x": 672, "y": 504}, {"frame": 4, "x": 595, "y": 462},
    {"frame": 2, "x": 142, "y": 378}, {"frame": 1, "x": 168, "y": 378},
    {"frame": 0, "x": 714, "y": 336},
    {"frame": 4, "x": 420, "y": 294},
    {"frame": 1, "x": 515, "y": 126}, {"frame": 3, "x": 525, "y": 126}
  ],
  "coins": [
    {"x": 231, "y": 524}, {"x": 273, "y": 524}, {"x": 315, "y": 524}, {"x": 357, "y": 524},
    {"x": 819, "y": 524}, {"x": 861, "y": 524}, {"x": 903, "y": 524}, {"x": 945, "y": 524},
    {"x": 399, "y": 294}, {"x": 357, "y": 315}, {"x": 336, "y": 357},
    {"x": 777, "y": 357}, {"x": 819, "y": 357}, {"x": 861, "y": 357}, {"x": 903, "y": 357}, {"x": 945, "y": 357},
    {"x": 189, "y": 231}, {"x": 231, "y": 231},
    {"x": 525, "y": 147}, {"x": 567, "y": 147}, {"x": 609, "y": 147}, {"x": 651, "y": 147},
    {"x": 819, "y": 63}, {"x": 861, "y": 63}
  ],
  "hero": {"x": 21, "y": 525},
  "spiders": [],
  "spiders_save": [{"x": 121, "y": 399}, {"x": 800, "y": 362}, {"x": 500, "y": 147}],
  "door": {"x": 169, "y": 546},
  "key": {"x": 903, "y": 105}
}
*/
