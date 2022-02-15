import { Disclosure } from '@headlessui/react'
import { useState } from 'react'
import LoginForm from './loginForm'
import UserGrid from './userManagement'
Disclosure
export default function LoginPage() {
  const [getLock, setLock] = useState('')

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <main className="lg:min-h-full lg:overflow-hidden lg:flex lg:flex-row-reverse">
        {/*
        <div className="px-4 py-6 sm:px-6 lg:hidden">
          <div className="max-w-lg mx-auto flex">
            <a href="#">
              <span className="sr-only">Workflow</span>
              <img
                src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
                alt=""
                className="h-8 w-auto"
              />
            </a>
          </div>
        </div>

        <h1 className="sr-only">Checkout</h1>

         Account switcher mobile 
        <section aria-labelledby="order-heading" className="bg-gray-50 px-4 py-6 sm:px-6 lg:hidden">
          <Disclosure as="div" className="max-w-lg mx-auto">
            {({ open }) => (
              <>
                <div className="flex items-center justify-between">
                  <h2 id="order-heading" className="text-lg font-medium text-gray-900">
                    Your Order
                  </h2>
                  <Disclosure.Button className="font-medium text-indigo-600 hover:text-indigo-500">
                    {open ? <span>Hide full summary</span> : <span>Show full summary</span>}
                  </Disclosure.Button>
                </div>

                <Disclosure.Panel>
                  <ul role="list" className="divide-y divide-gray-200 border-b border-gray-200">
                    {products.map((product) => (
                      <li key={product.id} className="flex py-6 space-x-6">
                        <img
                          src={product.imageSrc}
                          alt={product.imageAlt}
                          className="flex-none w-40 h-40 object-center object-cover bg-gray-200 rounded-md"
                        />
                        <div className="flex flex-col justify-between space-y-4">
                          <div className="text-sm font-medium space-y-1">
                            <h3 className="text-gray-900">{product.name}</h3>
                            <p className="text-gray-900">{product.price}</p>
                            <p className="text-gray-500">{product.color}</p>
                            <p className="text-gray-500">{product.size}</p>
                          </div>
                          <div className="flex space-x-4">
                            <button type="button" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                              Edit
                            </button>
                            <div className="flex border-l border-gray-300 pl-4">
                              <button
                                type="button"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <form className="mt-10">
                    <label htmlFor="discount-code-mobile" className="block text-sm font-medium text-gray-700">
                      Discount code
                    </label>
                    <div className="flex space-x-4 mt-1">
                      <input
                        type="text"
                        id="discount-code-mobile"
                        name="discount-code-mobile"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <button
                        type="submit"
                        className="bg-gray-200 text-sm font-medium text-gray-600 rounded-md px-4 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                      >
                        Apply
                      </button>
                    </div>
                  </form>

                  <dl className="text-sm font-medium text-gray-500 mt-10 space-y-6">
                    <div className="flex justify-between">
                      <dt>Subtotal</dt>
                      <dd className="text-gray-900">{subtotal}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="flex">
                        Discount
                        <span className="ml-2 rounded-full bg-gray-200 text-xs text-gray-600 py-0.5 px-2 tracking-wide">
                          {discount.code}
                        </span>
                      </dt>
                      <dd className="text-gray-900">-{discount.amount}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Taxes</dt>
                      <dd className="text-gray-900">{taxes}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Shipping</dt>
                      <dd className="text-gray-900">{shipping}</dd>
                    </div>
                  </dl>
                </Disclosure.Panel>

                <p className="flex items-center justify-between text-sm font-medium text-gray-900 border-t border-gray-200 pt-6 mt-6">
                  <span className="text-base">Total</span>
                  <span className="text-base">{total}</span>
                </p>
              </>
            )}
          </Disclosure>
        </section> */}

        {/* Account switcher */}
        <section aria-labelledby="summary-heading" className="hidden bg-gray-50 w-full max-w-xs flex-col lg:flex">
          <h2 id="summary-heading" className="sr-only">
            Order summary
          </h2>

          <UserGrid clickOnProfile={(username) => setLock(username)}/>
        </section>

        {/* Login */}
        <section
          aria-labelledby="payment-heading"
          className="flex-auto overflow-y-auto px-4 pt-12 pb-16 sm:px-6 sm:pt-16 lg:px-8 lg:pt-0 lg:pb-24"
        >
          <div className="max-w-lg mx-auto">
            <LoginForm isLock={getLock} replaceLock={() => setLock('')}/>
          </div>
        </section>
      </main>
    </>
  )
}
