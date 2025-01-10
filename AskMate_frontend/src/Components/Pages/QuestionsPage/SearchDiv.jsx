import "./SearchDiv.css";


export default function SearchDiv({ setSearchedWords }) {


    return (
        <div className="main">
            Search In Questions <br />
            <input onChange={(e) => { setSearchedWords(e.target.value) }} type="text" name="searchField" id="searchField" />
        </div>
    )
}