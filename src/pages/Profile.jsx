import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BaseUrl } from '../configurations/config';
import { getToken, getUser } from '../services/localStorageService';
import MenuNavigate from '../components/MenuNavigate';
import ProfileDisplay from '../components/ProfileDisplay';
import { useParams } from 'react-router';
import { isBelongTo } from '../services/inbound';

export default function Profile() {
  const token = getToken();
  const {alias} = useParams();
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (alias) {

      axios.get(`${BaseUrl.uri}/profile/author/${alias}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        setUser(null)
        setUser(response.data.data);
        setIsOwner(isOwner(response.data.data.id));
      }).catch((error) => {
        console.error(error);
      });
    }  else {
      setUser(getUser());
      setIsOwner(true);
      }
  },[]);


  return (
    <div>
      <MenuNavigate />
      {user && <ProfileDisplay user={user} isOwner={isOwner} />}
    </div>
  )
}
