import React from 'react'
import Layout from '../Layout/Layout'

function Blog() {
  return (
    <Layout>
      
    <div>
    <div className="container mx-auto px-3 py-10 bg-white dark:bg-gray-800">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Blog</h1>
      <div className="flex flex-wrap -m-4">
        <div className="p-4 md:w-1/3">
          <div className="rounded overflow-hidden shadow-lg bg-white dark:bg-gray-700 m-4">
            <img className="w-full h-48 object-cover" src="https://picsum.photos/200/300" alt="Blog Image"/>
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">The Coldest Sunset</div>
              <p className="text-gray-700 dark:text-gray-300 text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2 flex items-center justify-between">
              <span className="inline-block bg-gray-200 dark:bg-gray-600 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 mr-2 mb-2">#photography</span>
              <span className="inline-block bg-gray-200 dark:bg-gray-600 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 mr-2 mb-2">#travel</span>
              <span className="inline-block bg-gray-200 dark:bg-gray-600 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">#winter</span>
            </div>
          </div>
        </div>
        <div className="p-4 md:w-1/3">
          <div className="rounded overflow-hidden shadow-lg bg-white dark:bg-gray-700 m-4">
            <img className="w-full h-48 object-cover" src="https://picsum.photos/200/301" alt="Blog Image"/>
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">The Coldest Sunset</div>
              <p className="text-gray-700 dark:text-gray-300 text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2 flex items-center justify-between">
              <span className="inline-block bg-gray-200 dark:bg-gray-600 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 mr-2 mb-2">#photography</span>
              <span className="inline-block bg-gray-200 dark:bg-gray-600 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 mr-2 mb-2">#travel</span>
              <span className="inline-block bg-gray-200 dark:bg-gray-600 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">#winter</span>
            </div>
          </div>
        </div>
        <div className="p-4 md:w-1/3">
          <div className="rounded overflow-hidden shadow-lg bg-white dark:bg-gray-700 m-4">
            <img className="w-full h-48 object-cover" src="https://picsum.photos/200/302" alt="Blog Image"/>
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">The Coldest Sunset</div>
              <p className="text-gray-700 dark:text-gray-300 text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2 flex items-center justify-between">
              <span className="inline-block bg-gray-200 dark:bg-gray-600 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 mr-2 mb-2">#photography</span>
              <span className="inline-block bg-gray-200 dark:bg-gray-600 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 mr-2 mb-2">#travel</span>
              <span className="inline-block bg-gray-200 dark:bg-gray-600 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">#winter</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </Layout>

  )
}

export default Blog
