import { FC } from 'react'
import { Button } from 'react-bootstrap'
import './SearchField.css'

interface Props {
    value: string
    setValue: (value: string) => void
    // onSubmit: () => void
    loading?: boolean
    placeholder?: string
    buttonTitle?: string
}

const SearchField: FC<Props> = ({ value, setValue, loading, placeholder, buttonTitle = 'Искать' }) => (
    <div className="searchField">
        <input value={value} placeholder={placeholder} onChange={(event => setValue(event.target.value))}/>
        {/* <Button disabled={loading} onClick={onSubmit}>{buttonTitle}</Button> */}
    </div>
)

export default SearchField