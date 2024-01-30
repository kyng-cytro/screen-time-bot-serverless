export const createScreenTimeAccount = async ({
  userId,
}: {
  userId: number;
}) => {
  try {
    const account = `screen_${userId}`;
    const url = new URL("https://next-episode.net/PAGES/misc/signup.php");
    url.searchParams.append("tz", "1");
    url.searchParams.append("reason", "join_next_ep_button");
    url.searchParams.append("allow_contact", "flase");
    url.searchParams.append("username", account);
    url.searchParams.append("pass1", account);
    url.searchParams.append("pass2", account);
    url.searchParams.append("email", `${account}@screentime.com`);
    const res = await fetch(url);
    if (!res.ok) {
      console.error("Error creating user account");
      return { account_id: null, k_value: null };
    }
    return await getScreenTimeAccountInfo({ userId });
  } catch (err) {
    console.error("Error creating user account:", err);
    return { account_id: null, k_value: null };
  }
};

export const getScreenTimeAccountInfo = async ({
  userId,
}: {
  userId: number;
}) => {
  try {
    const login_info = {
      username: `screen_${userId}`,
      password: `screen_${userId}`,
    };

    const loginResponse = await fetch("https://next-episode.net/userlogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: "PHPSESSID=ffa218c4b34cac302da2cb93b71b0021;",
      },
      body: new URLSearchParams(login_info),
    });

    if (!loginResponse.ok) {
      console.error("Login failed");
      return { account_id: null, k_value: null };
    }

    const pageText = await loginResponse.text();

    const account_id = pageText.match(/user_id=(\d*)/)?.[1] || null;
    const k_value = pageText.match(/&k=(.{32})/)?.[1] || null;
    return { account_id, k_value };
  } catch (err) {
    console.error("Error grabbing account info:", err);
    return { account_id: null, k_value: null };
  }
};

export const toggleScreenTimeWatchList = async ({
  accountId,
  kValue,
  showId,
}: {
  accountId: string;
  kValue: string;
  showId: string;
}) => {
  try {
    const url = new URL(
      "https://next-episode.net/PAGES/misc/toggle_watchlist.inc.php",
    );
    url.searchParams.append("k", kValue);
    url.searchParams.append("show_id", showId);
    url.searchParams.append("user_id", accountId);
    fetch(url);
  } catch (err) {
    console.error("An error occured toggling that show:", err);
  }
};
