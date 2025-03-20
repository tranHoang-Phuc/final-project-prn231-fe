import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BaseUrl } from '../configurations/config';
import { getToken, getUser } from '../services/localStorageService';
import MenuNavigate from '../components/MenuNavigate';
import ProfileDisplay from '../components/ProfileDisplay';

export default function Profile() {
  const token = getToken();
  const [user, setUser] = useState(getUser());
  const alias = new URLSearchParams(window.location.search).get('alias');
  
  useEffect(() => {
    if (alias) {
      axios.get(`${BaseUrl.uri}/profile/author/${alias}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        setUser(response.data.data);
      }).catch((error) => {
        console.error(error);
      });
      
    }
  },[]);


  return (
    <div>
      <MenuNavigate />
      <ProfileDisplay user={user} />
    </div>
  )
}
