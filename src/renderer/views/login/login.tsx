import { Disclosure } from '@headlessui/react'
import { useState } from 'react'
import LoginForm from './loginForm'
import UserGrid from './userManagement'
import { BrowserRouter as Router, Route } from 'react-router-dom';
Disclosure
function LoginPageContent() {
  const [getLock, setLock] = useState([''])
  const [deleteUser, setdeleteUser] = useState('')

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <main className="lg:min-h-full lg:overflow-hidden lg:flex lg:flex-row-reverse dark:bg-dark-level-two">


        {/* Account switcher */}
        <section aria-labelledby="summary-heading" className="hidden w-full max-w-xs flex-col lg:flex">


          <UserGrid clickOnProfile={(username) => setLock(username)} runDeleteUser={() => setdeleteUser('')} deleteUser={deleteUser} />
        </section>

        {/* Login */}
        <section
          aria-labelledby="payment-heading"
          className="flex-auto overflow-y-auto px-4 pt-12 pb-16 sm:px-6 sm:pt-16 lg:px-8 lg:pt-0 bg-white lg:pb-24 dark:bg-dark-level-one"
        >
          <div className="max-w-lg mx-auto">
            <LoginForm isLock={getLock} replaceLock={() => setLock([''])} runDeleteUser={(username) => setdeleteUser(username)}/>
          </div>
        </section>
      </main>
    </>
  )
}

export default function LoginPage() {
  return (
    <Router>
      <Route path="/" component={LoginPageContent} />
    </Router>
  );
}
