import React, {useEffect, useRef, useState} from 'react';
import s from './TextBox.module.css'
import '../fonts/robotomono.css'


const TextBox = () => {
    const [text, setText] = useState('lorem ipsum dolor sit amet consectetur adipisicing elit accusamus consequuntur cum cumque cupiditate deserunt distinctio illum laboriosam nesciunt nulla obcaecati optio quidem reprehenderit saepe sed sunt veritatis voluptas voluptate voluptatibus')
    const [indexOfCurrentCharacter, setIndexOfCurrentCharacter] = useState(0)
    const [lengthOfLines, setLengthOfLines] = useState([])
    const [mistakes, setMistakes] = useState([])
    // const [currentLine, setCurrentLine] = useState(0)
    // const [currentColumn, setCurrentColumn] = useState(0)


    useEffect(() => {
        const textBoxWidth = textRef.current.scrollWidth
        const words = textRef.current.textContent.split(/\s/)
        const lengthOfWords = words.map((word) => word.length)
        const LinesLength = []
        let sum = 0
        lengthOfWords.forEach((length) => {
            if ((sum + length) * 14.9 > textBoxWidth) {
                LinesLength.push(sum)
                sum = 0
            }
            sum += length + 1
        })
        console.log(LinesLength)
        setLengthOfLines(LinesLength)
    }, [])

    useEffect(() => {
        window.addEventListener('keydown', keyboardHandler);
        return () => {
            window.removeEventListener('keydown', keyboardHandler)
        }
    }, [keyboardHandler])
    const cursorRef = useRef()
    const textRef = useRef()


    function keyboardHandler(e) {

        const keyboardCharacter = (String.fromCharCode(e.keyCode).toLowerCase())
        let index = indexOfCurrentCharacter

        let curLine = 0
        let curPosition = 0
        let copyIndex = index
        for (let i in lengthOfLines){
            console.log(copyIndex,lengthOfLines[i])
            if(copyIndex>=lengthOfLines[i]){
                copyIndex-=lengthOfLines[i]
                curLine+=1
                console.log(copyIndex,lengthOfLines[i])
            }else {
                curPosition = copyIndex
                break
            }

        }

        if (e.keyCode===8 && index!==0){
            index--
            curPosition--
            setMistakes(mistakes.filter(el=>el!==index))


        }else{
            if (keyboardCharacter !== text[index]) {
                setMistakes([index, ...mistakes])
            }
            curPosition++
            if (curPosition === lengthOfLines[curLine]) {
                curPosition = 0
                curLine++
            }
            index++
        }
        cursorRef.current.style.top = `${(curLine) * 38 + 28}px`
        cursorRef.current.style.left = `${(curPosition) * 14.9 - 1}px`
        // setCurrentColumn(curPosition)
        // setCurrentLine(curLine)
        setIndexOfCurrentCharacter(index)
    }

    return (
        <div className={s.text__wrapper}>
            <div ref={cursorRef} className={s.cursor}/>
            <p ref={textRef} className={s.text}>
                {Array.from(text).map((character, id) =>
                    <span
                        className={`${id >= indexOfCurrentCharacter ? s.disabled__letter : ''} ${mistakes.includes(id) ? s.mistake__letter : ''}`}
                        key={id}>{character}
                    </span>

                )}
            </p>
        </div>
    );
};

export default TextBox;