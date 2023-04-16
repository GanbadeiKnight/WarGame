export default function getBuildingClass(building) {
  switch (building) {
    case 1:
      return 'building_capital';
    case 2:
      return 'building_midcity';
    case 3:
      return 'building_urban_1';
    case 4:
      return 'building_urban_2';
    case 5:
      return 'building_urban_3';
    case 6:
      return 'building_urban_4';
    case 7:
      return 'building_urban_5';
    case 8:
      return 'building_urban_6';
    case 9:
      return 'building_countryside';
    case 10:
      return 'building_factory';
    case 11:
      return 'mountain_1';
    case 12:
      return 'mountain_2';
    case 13:
      return 'mountain_3';
    case 14:
      return 'mountain_4';
    case 15:
      return 'mountain_5';
    case 16:
      return 'mountain_6';
    case 17:
      return 'mountain_7';
    case 18:
      return 'mountain_8';
    case 19:
      return 'mountain_9';
    case 20:
      return 'mountain_10';
    case 21:
      return 'mountain_11';
    case 22:
      return 'mountain_12';
    default:
      return '';
  }
}