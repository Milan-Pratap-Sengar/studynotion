import HighlightText from "../homepage/HighlightText";




function Quote(){
    return (
        <div>
            We are passionate about revolutionizing the way we learn. Our innovative platform
            <HighlightText text={"combines technology"}/>,
            <span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold"> expertise</span>
            , and community to create an 
            <span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold"> unparalleled educational experience.</span>

        </div>
    )
}

export default Quote;