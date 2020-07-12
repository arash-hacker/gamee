window.config = {

    //identifikátory překážek
    /*


        c1 - maly kruh - max. 0.05,
        c2 - velky kruh - max. 0.05,
        c22 - dvojty kruh - max. 0.07,
        m1 - dvojty kruh - max. 0.07,
        m11 - dvojty kruh - max. 0.07,
        f0 - kruhy v kruhu - max. 0.05,
        sg - kulicky - max. 0.05
        sp - pruh kostek - max 0.05
        sd - jednobarevny pruh - min 0.7


    */

    levels: [

        {
            score: 0,                           //score, od jakého platí následující nastavení
            speeds: {

                "c1": { min: 0.02, max: 0.03 },
                "c2": { min: 0.02, max: 0.03 },
                "c22": { min: 0.02, max: 0.03 },

                "m1": { min: 0.02, max: 0.03 },
                "m11": { min: 0.02, max: 0.03 },

                "f0": { min: 0.02, max: 0.03 },
                "sp": { min: 0.02, max: 0.03 },
                "sg": { min: 0.02, max: 0.03 },
                "sd": { min: 1, max: 3 },

            }
        },
        {
            score: 16,                         
            speeds: {

                "c1": { min: 0.02, max: 0.04 },
                "c2": { min: 0.02, max: 0.04 },
                "c22": { min: 0.02, max: 0.04 },

                "m1": { min: 0.02, max: 0.04 },
                "m11": { min: 0.02, max: 0.04 },

                "f0": { min: 0.02, max: 0.04 },
                "sp": { min: 0.02, max: 0.04 },
                "sg": { min: 0.02, max: 0.04 },
                "sd": { min: 1, max: 2 },

            }
        },
        {
            score: 19,                          
            speeds: {

                "c1": { min: 0.03, max: 0.04 },
                "c2": { min: 0.03, max: 0.04 },
                "c22": { min: 0.03, max: 0.04 },

                "m1": { min: 0.03, max: 0.04 },
                "m11": { min: 0.03, max: 0.04 },

                "f0": { min: 0.03, max: 0.04 },
                "sp": { min: 0.03, max: 0.04 },
                "sg": { min: 0.03, max: 0.04 },
                "sd": { min: 1, max: 2 },

            }
        },
        {
            score: 21,                           
            speeds: {

                "c1": { min: 0.03, max: 0.05 },
                "c2": { min: 0.03, max: 0.05 },
                "c22": { min: 0.03, max: 0.05 },

                "m1": { min: 0.03, max: 0.05 },
                "m11": { min: 0.03, max: 0.05 },

                "f0": { min: 0.03, max: 0.05 },
                "sp": { min: 0.03, max: 0.05 },
                "sg": { min: 0.03, max: 0.05 },
                "sd": { min: 1, max: 1.5 },

            }
        },
        {
            score: 24,                          
            speeds: {

                "c1": { min: 0.04, max: 0.05 },
                "c2": { min: 0.04, max: 0.05 },
                "c22": { min: 0.05, max: 0.06 },

                "m1": { min: 0.05, max: 0.06 },
                "m11": { min: 0.05, max: 0.06 },

                "f0": { min: 0.04, max: 0.05 },
                "sp": { min: 0.04, max: 0.05 },
                "sg": { min: 0.04, max: 0.05 },
                "sd": { min: 0.7, max: 1.5 },

            }
        },
        {
            score: 27,                          
            speeds: {

                "c1": { min: 0.04, max: 0.05 },
                "c2": { min: 0.04, max: 0.05 },
                "c22": { min: 0.06, max: 0.07 },

                "m1": { min: 0.06, max: 0.07 },
                "m11": { min: 0.06, max: 0.07 },

                "f0": { min: 0.04, max: 0.05 },
                "sp": { min: 0.04, max: 0.05 },
                "sg": { min: 0.04, max: 0.05 },
                "sd": { min: 0.7, max: 1 },

            }
        }
    ]

}
