import React, { useContext, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Container } from '@material-ui/core';
import axios from 'axios';
import { AppContext } from '../Context/AppContext';
import Data from './../components/Profile/Data';
import EditData from './../components/Profile/EditData';
import { UserType } from '../utils/Types';
const Profile = () => {
  const queryClient = useQueryClient();
  const { userState } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserType>(undefined);
  const fetchUserHandler = async () => {
    await axios
      .get('/user/me', {
        headers: {
          Authorization: `Bearer ${userState?.token}`,
        },
      })
      .then((res) => {
        //console.log(res.data);
        setUserData({
          name: res.data?.name,
          age: res.data?.age,
          email: res.data?.email,
          _id: res.data?._id,
        });
      })
      .catch((err) => {
        //console.log(err);
      });
  };
  const {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isFetched,
    refetch,
  } = useQuery('user', fetchUserHandler);
  if (isLoading) {
    return (
      <Container>
        <h3>Loading...</h3>
      </Container>
    );
  }
  if (isError) {
    return (
      <Container>
        <h5>Error: {error}</h5>
      </Container>
    );
  }
  return (
    <Container>
      {userData && (
        <>
          {isEditing ? (
            <EditData
              setIsEditing={setIsEditing}
              userData={userData}
              refetch={refetch}
            />
          ) : (
            <Data setIsEditing={setIsEditing} userData={userData} />
          )}
        </>
      )}
      {isFetching && (
        <Container>
          <h3>Loading...</h3>
        </Container>
      )}
    </Container>
  );
};

export default Profile;
