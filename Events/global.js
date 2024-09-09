import { ROOT_DIV } from "../Helper/constants.js";
import { globalState } from "../index.js";
import { renderHighlight, clearHighlight, selfHighlight, clearSelfHighlight, movePiece } from "../render/main.js";

let selfHighlightState = null
let moveState = null

function whitePawnClick({piece}){
    const current_pos = piece.current_position
    const flatArray = globalState.flat()

    // Clear selfhighlight of same piece
    if(selfHighlightState == piece){
        console.log(piece)
        clearSelfHighlight(selfHighlightState)
        selfHighlightState = null
        clearHighlight()
    } 
    else{
        // Highlight selected piece
        clearSelfHighlight(selfHighlightState)
        selfHighlight(piece)
        selfHighlightState = piece
    }


    // Add piece as move state
    moveState = piece

    if(current_pos[1] == 2){
        const highlightSquareIds = [`${current_pos[0]}${Number(current_pos[1])+1}`, `${current_pos[0]}${Number(current_pos[1])+2}`]
        clearHighlight()
        highlightSquareIds.forEach((highlight) => {
            globalState.forEach((row) => {
                row.forEach((element) => {
                    if(element.id == highlight){
                        element.highlight(true)
                    } 
                });
            });
        });
    }
}

function GlobalEvent(){
    ROOT_DIV.addEventListener("click", function(event){
        if (event.target.localName === "img") {
            const clickId = event.target.parentNode.id
            const flatArray = globalState.flat()
            const square = flatArray.find((el) => el.id == clickId)
            if(square.piece.piece_name == "WHITE_PAWN"){
                whitePawnClick(square)
            }
        }
        else{
            const clickedChild = Array.from(event.target.childNodes)

            if(clickedChild.length == 1 || event.target.localName == "span"){
                if (event.target.localName == "span") {
                    const id = event.target.parentNode.id
                    movePiece(moveState, id)
                    moveState = null
                }
                else{
                    const id = event.target.id
                    movePiece(moveState, id)
                    moveState = null
                }
            }
            else{
                clearHighlight()
                clearSelfHighlight(selfHighlightState)
            }
        }
    })
}
export {GlobalEvent}
