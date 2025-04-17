import { Link, matchPath, NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/Logo/Logo-Full-Light.png"
import NavbarLinks from "../../data/navbar-links"
import { useSelector } from "react-redux";
import { BsCart4 } from "react-icons/bs";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { IoMdArrowDropdownCircle } from "react-icons/io";


function Navbar(){

    const {token} = useSelector( (state) => state.auth )
    const {totalItems} = useSelector( (state) => state.cart )
    const {user} = useSelector( (state) => state.profile)

    const location=useLocation();
    function matchRoute(currentRoute){
        return matchPath({path:currentRoute}, location.pathname)
    }   

    // const [subLinks,setSubLinks]=useState([]);

    // const fetchSubLinks =   async () =>{
    //     try{
    //         const result= await apiConnector("GET", categories.CATEGORIES_API)
    //         console.log("Printing subLinks :-", result)
    //     }
    //     catch(err){
    //         console.log("Something went wrong while fetching the Catalogue");
    //     }
    // }

    // useEffect( () => {
    //     fetchSubLinks();
    // }, [] )


    const subLinks=[
        {
            title:"Python",
            link:"/catalog/python"
        },
        {
            title:"Web Development",
            link:"/catalog/web-development"
        }
    ]


    return (
        <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700">
            <div className="flex w-11/12 max-w-maxContent items-center justify-between">
            

            {/* ***************************** LOGO ****************************************/}
                <NavLink to={"/"}>
                    <img src={logo} alt="Logo" width={160} height={42}/>
                </NavLink>

            {/* ***************************** LINKS ***************************************** */}

                <nav>
                    <ul className="flex flex-row gap-x-6 text-richblack-25">
                        {
                            NavbarLinks.map( (link,index)=> {
                                    return <li key={index}>
                                        {
                                            link.title === 'Catalog' ?
                                            (
                                                <div className="relative flex gap-2 items-center group">
                                                    <p>{link.title}</p>
                                                    <IoMdArrowDropdownCircle/>

                                                    <div className="invisible absolute left-[50%] top-[50%] flex flex-col translate-x-[-50%] translate-y-[20%] rounded-md bg-richblue-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px]">
                                                        <div className="absolute left-[50%] top-0 translate-x-[80%] translate-y-[-35%] h-6 w-6 rotate-45 rounded bg-richblack-5"></div>

                                                        {
                                                            subLinks.length === 0 ? 
                                                            (
                                                                <div>
                                                                        Loading
                                                                </div>
                                                            ) :
                                                            (
                                                                subLinks.map( (subLinks, index) =>{
                                                                    return(
                                                                        <Link className="my-0.5" to={`${subLinks.link}`} key={index}>
                                                                            <div className=" p-3 hover:bg-richblack-50 cursor-pointer  w-full rounded-md">
                                                                                <p className="cursor-pointer">{subLinks.title}</p>
                                                                            </div>
                                                                        </Link>
                                                                    )
                                                                } )
                                                            )
                                                        }
                                                    </div>                                             
                                                </div>
                                            ) :
                                            (
                                                <NavLink to={link?.path}>
                                                    <p className={` cursor-pointer text-white ${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                                                        {link.title}
                                                    </p>
                                                </NavLink>
                                            )
                                        }
                                    </li>
                            } )
                        }
                    </ul>
                </nav>
                
                {/* ************************* BUTTONS AND CART ******************** */}

                <div className="flex gap-x-4 items-center">
                        {
                            user && user?.accountType !== "Instructor" && (
                                <Link to="/dashboard/cart" className="relative">
                                    <BsCart4/>
                                    {
                                        totalItems > 0 && (
                                            <span>
                                                {totalItems}
                                            </span>
                                        )
                                    }
                                </Link>
                            )
                        }

                        {
                            token === null && (
                                <Link to={"/login"}>
                                    <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md hover:scale-95">
                                        Log In
                                    </button>
                                </Link>
                            )
                        }

                        {
                            token === null && (
                                <Link to={"/signup"}>
                                    <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md hover:scale-95">
                                        Sign Up
                                    </button>
                                </Link>
                            )
                        }
                        {
                            token !== null && <ProfileDropDown/>
                        }
                </div>

            </div>
        </div>
    )
}

export default Navbar;