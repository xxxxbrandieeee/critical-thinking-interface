import { useEffect } from 'react'
import './Page_ending.css'

export default function Page_ending() {
    return (
        <div className='Page_ending_content'>
            {/* TODO: Customize the platform name and redirect link below for your recruitment platform */}
            <h2>Thank you for your participation! Please click the following link to return to [YOUR_PLATFORM_NAME]: <a href="[YOUR_REDIRECT_LINK]">[YOUR_REDIRECT_LINK]</a>.</h2>

            {/* <Button className='next_btn' type="primary" onClick={next}>next</Button> */}
        </div>
    )
}
