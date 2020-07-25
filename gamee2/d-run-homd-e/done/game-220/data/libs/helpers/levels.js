var levels = function () {
    var levelsList = {

        easyLevels: [

            [
                ['coin','coin','coin','coin'],
                ['coin','none','coin'],
                ['coin'],
            ],
            
            [
                ['coin','coin','coin','coin'],
                ['rocket','none','rocket'],
                ['coin'],
            ],
            
            [
                ['coin','none','none','coin'],
                ['coin','jet','coin'],
                ['coin'],
            ],
            
            [
                ['coin','none','none','coin'],
                ['coin','none','none','coin'],
                ['coin','none','none','coin'],
                ['arrowLeft','none','none','arrowRight'],

            ],
            
            [
                ['coin'],
                ['rocket'],
                ['coin'],
                ['coin','coin'],

            ],
            
            [
                ['coin','coin'],
                ['coin','none','coin'],
                ['coin'],
            ],
            
            [
                ['coin','none','coin'],
                ['none'],
                ['coin','none','coin'],
                ['none'],
                ['coin','none','coin'],
            ],
            
            [
                ['coin','none','coin'],
                ['coin','rocket','coin'],
                ['coin','none','coin'],
                ['arrow','arrow','arrow'],
            ],
            
            [
                ['coin','none','coin'],
            ],
            
            [
                ['coin','coin'],
                ['coin','jet'],
                ['coin','coin'],

            ],
            
            [
                ['coin','none','coin'],
                ['coin','none','rocket'],
                ['coin','none','coin'],

            ],
            
            [
                ['coin','coin'],
                ['coin','coin'],
                ['arrowLeft','none','arrowRight'],

            ],
            
            [
                ['coin'],
                ['coin','coin','coin','rocket'],

            ],
            
            [
                ['coin'],
                ['coin','coin'],
                ['coin','coin','coin','jet'],

            ],
            
            [
                ['coin'],
                ['coin','coin'],
                ['coin','coin'],
                ['rocket','arrow','arrow','rocket'],

            ],
            
            [
                ['coin'],
                ['coin','coin'],
                ['coin','coin','coin'],

            ],
            
            [
                ['coin'],
                ['coin','coin'],
                ['coin','coin','rocket'],

            ],
            
            [
                ['rocket'],
                ['coin','coin'],
                ['coin','coin'],
                ['coin','coin'],

            ],
        ],

        mediumLevels: [
            
            [
                ['coin','none','coin'],
                ['none'],
                ['coin','none','coin'],
                ['none'],
                ['coin','arrow','coin'],
            ],
            [
                ['coin','coin','coin'],
                ['coin','none','coin','none','rocket']

            ],
            [
                ['coin','coin','coin'],
                ['coin','coin'],
                ['arrow']
            ],
            [
                ['coin','coin','coin'],
                ['coin','none','none','jet'],
                ['none'],
                ['coin','none','coin'],
            ],
            [
                ['coin','none','coin'],
                ['coin','none','coin'],
                ['arrowLeft','none','arrowRight'],
            ],
            
            [
                ['coin'],
                ['coin','coin'],
                ['coin','none','coin'],

            ],
            
            [
                ['rocket'],
                ['coin','none','coin'],
                ['jet','arrow','arrow','arrow'],

            ],
            
            [
                ['coin'],
                ['coin','none','coin'],
                ['coin','none','arrowRight'],

            ],
            
            [
                ['coin'],
                ['coin','none','coin'],
                ['coin','arrow','coin'],

            ],
            
            [
                ['coin','none','coin'],
                ['coin','none','coin'],
                ['coin','none','coin'],

            ],
            
            [
                ['coin','none','coin'],
                ['coin','none','coin'],
                ['coin','none','coin','none','rocket'],

            ],
            
            [
                ['coin','none','coin'],
                ['coin','coin','coin'],
                ['coin'],

            ],
            
            [
                ['coin','jet','coin'],
                ['arrowRight','rocket','arrowLeft'],
                ['coin'],

            ],
            
            [
                ['coin','none','coin'],
                ['none','coin','none'],
                ['coin','none','coin'],

            ],
            [
                ['coin','jet','coin'],
                ['arrowRight','rocket','arrowLeft'],
                ['coin'],

            ],
            
            [
                ['coin','rocket','coin']  
            ],
            
            [
                ['coin','jet','coin'],
                ['arrowRight','rocket','arrowLeft'],
                ['coin'],

            ],
        ],

        hardLevels: [
            
            [
                ['coin','monster','coin'],
                ['coin','none','coin'],
                ['rocket','coin','none'],

            ],
            
            [
                ['coin','none','rocket'],
                ['coin','none','coin'],
                ['coin','none','coin'],

            ],
            
            [
                ['monster','coin','rocket'],
                ['coin','coin'],
                ['coin','coin'],

            ],
            
            [
                ['coin','coin','coin'],
                ['coin','rocket'],
                ['coin','coin'],

            ],
            
            [
                ['coin','coin','monster'],
                ['coin','coin'],
                ['coin','coin'],

            ],
            
            [
                ['coin','coin','coin'],
                ['coin','none','coin'],
                ['coin','none','coin'],

            ],
            
            [
                ['rocket','coin'],
                ['coin','coin','coin'],
                ['coin','none','rocket'],

            ],
            
            [
                ['monster','coin'],
                ['coin','coin','coin'],

            ],
            
            [
                ['coin','coin','coin'],
                ['coin','rocket'],
                ['coin','coin'],

            ],
        ],

    }
	function getLevels(){

		return levelsList
	}

	return{
		getLevels:getLevels,
	}
		
}()