import { Link, matchPath, NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/Logo/Logo-Full-Light.png"
import NavbarLinks from "../../data/navbar-links"
import { useSelector } from "react-redux";
import { BsCart4 } from "react-icons/bs";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { useEffect, useState } from "react";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { BsChevronDown } from "react-icons/bs"

function Navbar(){

    const {token} = useSelector( (state) => state.auth )
    const {totalItems} = useSelector( (state) => state.cart )
    const {user} = useSelector( (state) => state.profile)

    const [subLinks,setSubLinks]=useState([])
    const [loading,setLoading]=useState(false)

    const location=useLocation();



    function matchRoute(currentRoute){
        return matchPath({path:currentRoute}, location.pathname)
    }   

    const getCategories=async()=>{
        setLoading(true)
        try{
            const response=await apiConnector("GET", categories.CATEGORIES_API)
            console.log("GET CATEGORIES API RESPONSE............", response.data.categories)
            if (!response) {
                throw new Error("Could not fetch Categories.")
            }
            setSubLinks(response.data.categories)
        }
        catch(error){
            console.log("GET CATEGORIES API ERROR...............", error)
        }
        setLoading(false)
    }

    useEffect(()=>{
        getCategories()
    },[])


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
                                                <>
                                                    <div className={`group relative flex cursor-pointer items-center gap-1 ${ matchRoute("/catalog/:catalogName") ? "text-yellow-25" : "text-richblack-25"}`}>
                                                        <p>{link.title}</p>
                                                        <BsChevronDown />
                                                        <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                                            <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                                                            {
                                                                loading ? 
                                                                (<p className="text-center">Loading...</p>) :
                                                                subLinks.length ? (
                                                                    <>
                                                                        {
                                                                            subLinks?.filter((subLink) => subLink?.courses?.length > 0)?.map((subLink, i) => (
                                                                                <Link to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`} className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50" key={i}>
                                                                                    <p>{subLink.name}</p>
                                                                                </Link>
                                                                            ))
                                                                        }
                                                                    </>
                                                                ) :
                                                                (<p className="text-center">No Courses Found</p>)
                                                            }
                                                        </div>
                                                    </div>
                                                </>
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

