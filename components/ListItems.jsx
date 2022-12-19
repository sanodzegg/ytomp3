import React from 'react'

const ListItems = ({ emitRemove, url }) => {
    return (
        <li onClick={() => emitRemove(url)} className="dark:text-white dark:border-slate-600 px-6 py-2 border-b border-gray-200 w-full h-10
        dark:hover:bg-red-900 hover:bg-red-300 cursor-pointer">{url}</li>
    )
}

export default ListItems;