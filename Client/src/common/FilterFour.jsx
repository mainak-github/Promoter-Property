import React, { useContext } from 'react';
import { useFormik } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const FilterFour = () => {

    const navigate = useNavigate();

    // Input Field Validation Start 
    const formik = useFormik({
        initialValues: {
          searchKeyword: "",
        },
        // Validate by Yup
        validationSchema: yup.object({
            searchKeyword: yup.string().min(3, "Too Short! Must be at least 3 characters long").required(),
        }),
    
        onSubmit: (values, { resetForm }) => {
            // alert(JSON.stringify(values, null, 2));
            resetForm({ values: "" });
            toast.success("Congratulations! You Have Searched Successfully.", {
                theme: "colored",
            });

            // Navigate To Property Page
            navigate("/property-sidebar");
        },
    });

    const renderNameError = formik.touched.searchKeyword && formik.errors.searchKeyword && (
        <span className="text-danger mt-1">{formik.errors.searchKeyword}</span>
    );
    // Input Field Validation End
    
    return (
        <>  
            <ToastContainer/>
            <form action="#" onSubmit={formik.handleSubmit} className="search-keyword position-relative">
                <div className="position-relative">
                    <input 
                        type="text" 
                        placeholder="Enter Keyword"
                        name='searchKeyword'
                        id='name'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        className={`common-input common-input--lg ${
                            formik.touched.name && formik.errors.name ? "is-invalid" : ""
                        }`}
                    />
                    <button type="submit" className="btn btn-main text-capitalize">
                        <span className="icon-left icon"> 
                            <i className="fas fa-search"></i> 
                        </span>
                        Search 
                    </button>
                </div>
                {renderNameError}
            </form>
        </>
    );
};

export default FilterFour;