import { useMutation, useQuery } from "@tanstack/react-query";
import { GetData, PostData } from "../../../../api/API";
import Loader from "../../../../components/common/Loader";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const IdpTerms = () => {
  const { data: profileData, loading: profileDataLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => GetData(`clinician/profile`),
  });
  const { data, isLoading, error } = useQuery({
    queryKey: ["idp-terms"],
    queryFn: () => GetData(`idp/disclaimer/${profileData?.dosespotId}`),
    enabled: !!profileData?.dosespotId,
  });
  const navigate = useNavigate();

  const accept = useMutation({
    mutationKey: ["accept-terms"],
    mutationFn: (payload) =>
      PostData(`idp/disclaimer/${profileData?.dosespotId}/accept`, payload),
    onSuccess: (data) => {
      toast.success(data?.message);
      navigate("/idp/info");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
  });
  const initIdp = useMutation({
    mutationKey: ["init-idp"],
    mutationFn: () => PostData(`idp/init/${profileData?.dosespotId}`),
  });

  useEffect(() => {
    if (profileData?.dosespotId) {
      initIdp.mutate();
    }
  }, [profileData]);

  return isLoading ? (
    <p className="flex items-center justify-center h-screen">
      <Loader color="#000000" />
    </p>
  ) : error ? (
    <p className="texte-center flex items-center justify-center h-60">
      Something went wrong.
    </p>
  ) : (
    <div className="flex items-center justify-center py-20 max-w-4xl mx-auto">
      <div>
        <p className="text-center text-2xl font-semibold pb-5">
          IDP Verification
        </p>
        <p className="py-5 text-center bg-slate-100 p-4 rounded-xl">
          {data?.IdpDisclaimerText || "Not Found"}
        </p>
        <div className="pt-5 flex items-center justify-center">
          <button
            onClick={() =>
              accept.mutate({ idpDisclaimerId: String(data?.IdpDisclaimerId) })
            }
            className="max-w-[250px] w-full py-2 bg-primaryColor text-white rounded-xl"
          >
            {accept?.isPending ? <Loader /> : <>Accept</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdpTerms;
