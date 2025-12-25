import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')

    const handleLogin = async (event) => {
        event.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signInWithOtp({ email })

        if (error) {
            alert(error.error_description || error.message)
        } else {
            alert('Check your email for the login link!')
        }
        setLoading(false)
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-app)' }}>
            <div className="card" style={{ width: '400px', textAlign: 'center' }}>
                <h1 style={{ marginBottom: '1.5rem', color: 'var(--primary-500)' }}>BUILTLY</h1>
                <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Sign in with your magic link</p>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        required={true}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border-light)',
                            outline: 'none'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '0.75rem',
                            backgroundColor: 'var(--primary-500)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Sending magic link...' : 'Send Magic Link'}
                    </button>
                </form>
            </div>
        </div>
    )
}
