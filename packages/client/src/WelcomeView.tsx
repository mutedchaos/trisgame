import React, { useCallback, useState } from 'react'
import qs from 'qs'

export default function WelcomeView() {
  const [name, setName] = useState(localStorage.getItem('tris-name') ?? '')

  const updateName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    localStorage.setItem('tris-name', e.target.value)
  }, [])

  const [code, setCode] = useState('')

  const updateCode = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value)
  }, [])

  const createGame = useCallback(async () => {
    try {
      const resp = await fetch('/game?' + qs.stringify({ name }), {
        method: 'POST',
      })
      if (resp.status !== 200) {
        alert(await resp.text())
      } else {
        const data = await resp.json()
        document.location.href = '/?id=' + data.id
      }
    } catch (err) {
      alert(err.message)
    }
  }, [name])

  const joinGame = useCallback(async () => {
    try {
      const resp = await fetch('/join?' + qs.stringify({ name, code }), {
        method: 'POST',
      })
      if (resp.status !== 200) {
        alert(await resp.text())
      } else {
        const data = await resp.json()
        document.location.href = '/?id=' + data.id
      }
    } catch (err) {
      alert(err.message)
    }
  }, [code, name])

  return (
    <div>
      <h1>Welcome!</h1>
      <p>
        Your name: <input type="text" value={name} onChange={updateName} />
      </p>
      <p>
        <button onClick={createGame} disabled={!name}>
          Create game
        </button>
      </p>
      <p>or</p>
      <p>
        <button onClick={joinGame} disabled={!name || !code}>
          Join game
        </button>{' '}
        <input type={'text'} placeholder={'Enter code here'} value={code} onChange={updateCode} />
      </p>
    </div>
  )
}
