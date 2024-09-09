import * as p from "../data/pieces.js";
import { ROOT_DIV } from "../Helper/constants.js";
import { globalState } from "../index.js";

function pieceRender(data){                                         // Used to render pieces
    data.forEach((row) => {
        row.forEach((square) => {
            if(square.piece){
                const sqEl = document.getElementById(square.id)
                const piece = document.createElement("img")
                piece.src = square.piece.img 
                piece.classList.add("piece")
                sqEl.appendChild(piece)
            }
        });
    });
}

function initGameRender(data){                                      // Only called once when game starts, renders the board
    data.forEach((element) => {
        const RowEl = document.createElement("div")
        element.forEach((square) => {
            const SquareDiv = document.createElement("div")
            SquareDiv.id = square.id
            SquareDiv.classList.add(square.color, "square")
            if(square.id[1] == 2){
                square.piece = p.whitePawn(square.id)
            }
            if(square.id == "b1" || square.id == "g1"){
                square.piece = p.whiteKnight(square.id)
            }
            if(square.id == "c1" || square.id == "f1"){
                square.piece = p.whiteBishop(square.id)
            }
            if(square.id == "a1" || square.id == "h1"){
                square.piece = p.whiteRook(square.id)
            }
            if(square.id == "d1"){
                square.piece = p.whiteQueen(square.id)
            }
            if(square.id == "e1"){
                square.piece = p.whiteKing(square.id)
            }
            if(square.id[1] == 7) {
                square.piece = p.blackPawn(square.id)
            }
            if(square.id == "b8" || square.id == "g8"){
                square.piece = p.blackKnight(square.id)
            }
            if(square.id == "c8" || square.id == "f8"){
                square.piece = p.blackBishop(square.id)
            }
            if(square.id == "a8" || square.id == "h8"){
                square.piece = p.blackRook(square.id)
            }
            if(square.id == "d8"){
                square.piece = p.blackQueen(square.id)
            }
            if(square.id == "e8"){
                square.piece = p.blackKing(square.id)
            }
            RowEl.appendChild(SquareDiv)
        });
        RowEl.classList.add("squareRow")
        ROOT_DIV.appendChild(RowEl)
    });
    pieceRender(data)
}

function renderHighlight(squareId){                                 // Used to highlight possible moves
    const highlightSpan = document.createElement("span")
    highlightSpan.classList.add("highlight")
    document.getElementById(squareId).appendChild(highlightSpan)
}

function clearHighlight(){                                          // Used to clear previous highlights
    const flatData = globalState.flat()
    flatData.forEach((el) => {
        if(el.highlighted){
            document.getElementById(el.id).innerHTML = ""
            el.highlighted = false
        }
    });
}

function selfHighlight(piece){                                      // Used to give yellow highlight to the clicked piece
    document.getElementById(piece.current_position).classList.add("highlightYellow")
}

function clearSelfHighlight(piece){                                 // Used to clear yellow highlight
    if(piece){
        document.getElementById(piece.current_position).classList.remove("highlightYellow")
    }
}

function movePiece(piece, id){                                      // Used to move pieces on the board    
    
    const flatData = globalState.flat()
    clearHighlight()
    flatData.forEach((el) => {
        if(el.id == piece.current_position){
            delete el.piece
        }
        if(el.id == id){
            el.id = piece
        }
    });
    const previousPiece = document.getElementById(piece.current_position)
    previousPiece.classList.remove("highlightYellow")
    const currentPiece = document.getElementById(id)
    currentPiece.innerHTML = previousPiece.innerHTML
    previousPiece.innerHTML = ""
    piece.current_position = id
}


export {initGameRender, renderHighlight, clearHighlight, selfHighlight, clearSelfHighlight, movePiece}


