function changeMap(mapId, map_container) {
    console.log("changeMap:2," + "mapId:" + mapId +",map_container:" + map_container);
    switch (mapId) {
        case "map_1656_ysk_mae":
            map1656YskMae(mapId, map_container);
            break;
        case "map_1851_ymkz":
            map1851Ymkz(mapId, map_container);
            console.log("ECMAScript 2015");
            break;
        case "map_1859_ykjz":
            map1859Ykjz(mapId, map_container);
            console.log("ECMAScript 2016");
            break;
        case "map_1860_tyf":
            map1860Tyf(mapId, map_container);
                console.log("changeMap:17," + "mapId:" + mapId +",map_container:" + map_container);
            break;
        case "map_1860_ymi":
            map1860Ymi(mapId, map_container);
                console.log("ECMAScript 2016");
            break;
        case "map_1861_syf":
            map1861Syf(mapId,  map_container);
                console.log("ECMAScript 2016");
            break;
        case "map_1865_gkyzz":
            map1865Gkyzz(mapId, map_container);
                console.log("ECMAScript 2016");
            break;
        case "map_now":
            mapNow(mapId, map_container);
                console.log("ECMAScript 2016");
            break;
        case "map_sanpo":
            mapSanpo(mapId, map_container);
            console.log("ECMAScript 2016");
            break;
        default:
            console.log("しらないバージョンです");
            break;
    }
}
