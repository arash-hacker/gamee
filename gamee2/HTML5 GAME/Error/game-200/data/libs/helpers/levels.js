var levels = function () {

	function getLevels(){
        
		var levelsList = {

			easyLevels: [
                
                [
                    ["square","rhombus","triangle","triangle","rhombus","cross"],
                ],
                
                [
                    ["cross","rhombus","cross","rhombus","cross"],
                    ["rhombus","cross","rhombus","cross","rhombus"],
                ],
                
                [
                    ["rectangle","rhombus","rhombus","rectangle"],
                    ["cross","cross","cross","triangle","cross","cross","cross"],
                ],
                
                [
                    ["square","square","rhombus","rhombus","square","square"],
                    ["circle","circle","circle","circle"],
                ],
                
                [
                    ["rectangle","rectangle"],
                    ["cross","cross","circle","circle","cross","cross"],
                    
                ],
                
                [
                    ["triangle"],
                    ["triangle","triangle"],
                    ["triangle","triangle","triangle"],
                    
                ],
                
                [
                    ["circle","circle","rhombus","rhombus","circle","circle"],
                    ["circle","circle","circle","circle","circle","circle"],
                    ["rectangle","rectangle"],
                    
                ],
                
                
                [
                    ["cross","cross","cross","cross"],
                    ["cross","cross","cross"],
                    ["rectangle","rectangle"],
                    
                ],
                
                [
                    ["cross","cross"],
                    ["circle","circle","circle"],
                    
                ],
                
                [   
                    ["circle","circle","circle","circle","circle","circle"],
                    ["circle","rectangle","circle"],                    
                ],
                
                [   
                    ["cross","circle","circle","circle","circle","cross"],
                    ["square","rectangle","square"],                    
                ],
                
                [   
                    ["rectangle","rectangle"],
                    ["circle","circle","circle","circle","circle","circle"],
                ],
                
                [   
                    ["square","square","square"],
                    ["circle","triangle","circle"],
                   
                ],
                
                [   
                    ["square","square","square"],
                    ["cross","rhombus","cross"],
                    ["circle","triangle","circle"],
                   
                ],
                
                [   
                    ["circle","circle","circle","circle"],
                    ["circle","circle","triangle","circle","circle"],
                   
                ],
            ],
            
            mediumLevels: [
                
                [
                    ["cross","circle","cross","circle","cross"],
                    ["cross","circle","cross","circle","cross"],
                    ["cross","circle","cross","circle","cross"],
                    ["cross","circle","cross","circle","cross"],
                    ["rectangle"],

                ],
                
                [
                    ["rectangle","rectangle","rectangle"],
                    ["square","square"],
                    ["square","square"],
                    ["square","square"],
                    ["square","square"],
                    ["square","square"],
                    ["square","square"],
                    ["rectangle","rectangle","rectangle"],
                ],
                
                [
                    ["square"],
                    ["circle","triangle","circle"],
                    ["square","square","square","square"],
                    ["circle","cross","circle"],
                    ["square"],
                ],
                
                [
                    ["triangle"],
                    ["circle","circle","circle"],
                    ["square","square","square","square"],
                    ["circle","circle","circle"],
                    ["triangle"],
                ],
                
                [
                    ["triangle"],
                    ["bar","circle","triangle","circle","bar"],
                    ["square","square","square","square"],
                    ["circle","cross","circle"],
                    ["triangle"],
                ],
                
                [
                    ["bar","cross","square","cross","square","cross","bar"],
                    ["bar","cross","square","cross","square","cross","bar"],
                    ["bar","cross","square","cross","square","cross","bar"],
                    ["bar","cross","square","cross","square","cross","bar"],

                ],
                
                [
                    ["bar","square","square","cross","square","square","bar"],
                    ["bar","square","square","cross","square","square","bar"],
                    ["bar","square","square","cross","square","square","bar"],
                    ["cross","cross","cross","cross","cross"],
                ],
                
                [
                    ["circle","circle","circle","circle","circle"],
                    ["circle","circle","circle","circle","circle"],
                    ["bar","circle","circle","circle","circle","circle","bar"],
                    ["bar","triangle","triangle","triangle","triangle","bar"],

                ],
                
                [
                    ["triangle","triangle"],
                    ["triangle","triangle","triangle","triangle"],
                    ["bar","circle","circle","circle","circle","circle","bar"],
                    ["bar","cross","cross","cross","cross","bar"],

                ],
                
                [
                    ["circle"],
                    ["circle","circle","circle"],
                    ["circle","circle","circle","circle","circle"],
                    ["cross","cross"],
                    ["triangle"],

                ],
                
                [
                    ["circle"],
                    ["circle","circle","circle"],
                    ["circle","circle","circle","circle","circle"],
                    ["cross","cross"],
                    ["triangle"],

                ],
                
                [
                    ["cross"],
                    ["triangle","triangle","triangle"],
                    ["circle","circle","circle","circle"],
                    ["rhombus","rhombus","rhombus"],
                    ["triangle"],

                ],
                
                [
                    ["circle","circle","circle","circle"],
                    ["rectangle","rectangle"],
                    ["rectangle"],
                    ["circle","circle","circle","circle"],

                ],
                
                [
                    ["circle","circle","circle","circle"],
                    ["circle","circle","circle","circle"],
                    ["circle","circle","circle","circle"],
                    ["triangle"],
                    ["triangle"],
                    ["rectangle"],

                ],
                
                [
                    ["triangle"],
                    ["rhombus","rhombus","rhombus"],
                    ["bar","circle","rectangle","circle","bar"],
                    ["bar","circle","rectangle","circle","bar"],

                ],
            ],
            
            hardLevels: [
                [
                    ["bar","circle","circle","cross","circle","circle","bar"],
                    ["square","square","square","square","square"],
                    ["circle","circle","circle"],
                    ["square"],
                ],
                
                [
                    ["bar","circle","circle","square","bar"],
                    ["bar","circle","circle","square","bar"],
                    ["bar","circle","circle","square","bar"],
                    ["bar","circle","circle","square","bar"],
                    ["bar","circle","circle","square","bar"],

                ],
                
                [
                    ["bar","circle","cross","circle","bar"],
                    ["bar","circle","cross","circle","bar"],
                    ["bar","circle","cross","circle","bar"],

                ],
                
                [

                    ["cross","cross","cross"],
                    ["bar","cross","cross","cross","bar"],
                    ["bar","circle","cross","circle","bar"],
                    ["bar","circle","cross","circle","bar"],

                ],
                
                [
                    ["bar","bar","rectangle","bar","bar"],
                    ["circle","circle","circle","circle","circle"],
                    ["circle","circle","circle","circle","circle"],
                    ["circle","circle","circle","circle","circle"],
                ],
                
                [
                    ["circle","circle"],
                    ["square","square","rhombus","rhombus","square","square"],
                    ["bar","circle","circle","circle","circle","bar"],
                    ["bar","circle","circle","circle","circle","bar"],
                ],
                
                [
                    ["bar","circle","circle","circle","circle","circle","bar"],
                    ["bar","square","square","square","square","bar"],
                    ["bar","cross","cross","cross","cross","bar"],
                    ["bar","triangle","triangle","triangle","triangle","bar"],

                ],
                
                [
                    ["bar","circle","circle","circle","circle","circle","bar"],
                    ["bar","square","square","square","square","bar"],
                    ["bar","cross","cross","cross","cross","bar"],
                    ["bar","triangle","triangle","triangle","triangle","bar"],

                ],
                
                [
                    ["bar","triangle","rectangle","triangle","bar"],
                    ["bar","triangle","rectangle","triangle","bar"],
                    ["circle","circle","circle","circle","circle","circle"],
                    ["circle","circle","circle","circle","circle","circle"],
                    
                ],
                
                [
                    ["bar","bar","rectangle","bar","bar"],
                    ["circle","circle","circle","circle","circle","circle"],
                    ["circle","circle","circle","circle"],
                    ["circle","circle","circle"],
                    
                ],
                
                [
                    ["rectangle","rectangle","rectangle"],
                    ["triangle","triangle","triangle"],
                    ["circle","circle","circle"],
                    ["circle","circle","circle"],
                    ["circle","rhombus","circle"],
                    
                ],
                
                [
                    
                    ["bar","empty150","bar"],
                    ["square","square"],
                    ["square","square"],
                    ["square","square"],
                    ["square","square"],
                    ["triangle"],
                    
                ],
                
                [
                    ["circle","circle","circle","cross","circle","circle"],
                    ["square","square","square","square","square"],
                    ["circle","circle","circle"],
                    ["triangle"],
                    ["rectangle"],
                    ["rhombus"],
                ],
                
                [
                    
                    ["rhombus","cross","rhombus"],
                    ["triangle","triangle"],
                    ["triangle","triangle"],
                    ["triangle","triangle"],
                    ["triangle","triangle"],
                    ["circle","circle"],
                    ["square","square"]
                    
                ],
                
                [
                    
                    ["bar","empty200","bar"],
                    ["bar","empty200","bar"],
                    ["bar","empty200","bar"],
                    ["bar","empty200","bar"],
                    ["bar","circle","circle","circle","bar"],
                    ["bar","circle","circle","circle","bar"],
                    
                ],
            ],

        }

		return levelsList

	}

	return{
		getLevels:getLevels,
	}
		
}()