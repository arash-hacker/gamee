window.config = {

    levels: [

        {
            score: 0,                           //score, od jakého platí následující nastavení
            minDist: 0.8,                       //minimální vzdálenost nového objektu od poslední překážky
            maxDist: 1,                       //maximální vzdálenost nového objektu od poslední překážky
            movingTypeProb: 0,                  //pravděpodobnost, že se další překážka bude pohybovat [%]
            changingTypeProb: 0,                //pravděpodobnost, že další překážka bude měnit strany
            obstacleGenerateTime: 0.5,            //časový rozestup mezi generováním překážek [s]
            obstacleGenerateCount: 1,           //maxímální počet překážek, které se po uplynutí časového rozestupu mohou vegenerovat najednou
            maxObstacles: 4,                    //maximální celkový počet vyditelných překážek
            bonusGenerateTime: 1,               //časový rozestup mezi generováním bonusů [s]
            bonusGenerateCount: 1,              //maxímální počet bonusů, které se po uplynutí časového rozestupu mohou vygenerovat najednou
            maxBonuses: 3                       //maximální celkový počet vyditelných bonusů

        },
        {
            score: 6,
            minDist: 0.8,
            maxDist: 1,
            movingTypeProb: 0,
            changingTypeProb: 10,
            obstacleGenerateTime: 0.5,
            obstacleGenerateCount: 1,
            maxObstacles: 4,
            bonusGenerateTime: 1,
            bonusGenerateCount: 1,
            maxBonuses: 3

        },
        {
            score: 11,
            minDist: 0.6,
            maxDist: 1,
            movingTypeProb: 0,
            changingTypeProb: 20,
            obstacleGenerateTime: 0.5,
            obstacleGenerateCount: 1,
            maxObstacles: 3,
            bonusGenerateTime: 1,
            bonusGenerateCount: 1,
            maxBonuses: 2

        },
        {
            score: 16,
            minDist: 0.5,
            maxDist: 1,
            movingTypeProb: 0,
            changingTypeProb: 30,
            obstacleGenerateTime: 0.5,
            obstacleGenerateCount: 1,
            maxObstacles: 3,
            bonusGenerateTime: 1,
            bonusGenerateCount: 1,
            maxBonuses: 2

        },
        {
            score: 30,
            minDist: 0.5,
            maxDist: 1,
            movingTypeProb: 10,
            changingTypeProb: 40,
            obstacleGenerateTime: 0.5,
            obstacleGenerateCount: 1,
            maxObstacles: 2,
            bonusGenerateTime: 1,
            bonusGenerateCount: 1,
            maxBonuses: 2

        },
{
    score: 50,
    minDist: 0.5,
    maxDist: 0.9,
    movingTypeProb: 20,
    changingTypeProb: 50,
    obstacleGenerateTime: 0.5,
    obstacleGenerateCount: 1,
    maxObstacles: 2,
    bonusGenerateTime: 1,
    bonusGenerateCount: 1,
    maxBonuses: 2

},
    ]


}