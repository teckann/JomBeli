"use client";

export function CategorySelect({categories}) {
    
    return (
        <div>
            <label htmlFor="categorySelect">Category</label>
            <select name="categorySelect" id="categorySelect">
                <option value="">Please Select</option>
                {categories.map((category) => {
                    return <option key={category} value={category} name="categorySelect">{category}</option>
                })}
            </select>
        </div>
    );
}