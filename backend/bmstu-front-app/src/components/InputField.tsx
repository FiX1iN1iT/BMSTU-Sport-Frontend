import './InputField.css'
import { FC } from 'react'
import { Button } from 'react-bootstrap'

interface Props {
    value: string
    setValue: (value: string) => void
    placeholder?: string
    onSubmit: () => void
    buttonTitle?: string
}

const InputField: FC<Props> = ({ value, setValue, placeholder, onSubmit, buttonTitle = 'Сохранить' }) => (
    <div className="inputField">
        <input value={value} placeholder={placeholder} onChange={(event => setValue(event.target.value))}/>
        <Button variant="danger" onClick={onSubmit}>{buttonTitle}</Button>
    </div>
)

export default InputField