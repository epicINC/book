# 案例 1

之前：

```c#
public FaceDetectResult FaceDetect(string ExhID,string ImageFile)
{
    string strRet="";
    FaceDetectResult objFac = new FaceDetectResult();
    try
    {
        Hashtable ht = new Hashtable();
        ht.Add("ExhID", ExhID);
        strRet = HttpUploadFile(mServerUrl + "/api/Face/FaceDetect", ImageFile, ht);
        objFac = JsonHelper.DeserializeJsonToObject<FaceDetectResult>(strRet);
    }
    catch (Exception ex)
    {
        objFac.status = "ERROR";
        if (strRet == "")
        {
            objFac.ErrorMsg = ex.Message;
        }
        else
        {
            objFac.ErrorMsg = strRet;
        }
    }
    return objFac;
}
```



- 状态 用枚举表示
- 避免无意义的初始化
- 参数合法性检查
- 变量命名
- 只放必要的代码在 try catch 中
- 使用泛型
- 使用初始化器
- 多用 var

改造后：

```c#
public FaceDetectResult Detect(string exhID, string imageFile)
{
    string result = null;
    var parameters = new Dictionary<string, string>()
    {
        { "ExhID",  exhID}
    };

    try
    {

        result = HttpUploadFile(ServerUrl + "/api/Face/FaceDetect", imageFile, parameters);
        if (String.IsNullOrWhiteSpace(result)) return FaceDetectResult.RequestFail();
        return JsonHelper.DeserializeJsonToObject<FaceDetectResult>(result);
    }
    catch (Exception ex)
    {
        return FaceDetectResult.Fail(result ?? ex.Message);
    }
}


public enum FaceDetectResultType
{
    Success,
    Error
}

public static FaceDetectResult Fail(string value)
{
    return new FaceDetectResult()
    {
        Status = FaceDetectResultType.Error,
        ErrorMsg = value
    };
}

public static FaceDetectResult RequestFail()
{
    return Fail("Request Fail.");
}

```



# 案例 2

之前：52

```c#

private string HttpUploadFile(string url, string file, Hashtable htPara)
{
    try
    {
        Uri server = new Uri(url);
        HttpClient httpClient = new HttpClient();

        //这里会向服务器上传一个png图片和一个txt文件
        MultipartFormDataContent multipartFormDataContent = new MultipartFormDataContent();
        FileStream fs = null;
        if (file != "")
        {
            fs = new FileStream(file, FileMode.Open, FileAccess.Read, FileShare.Read);
            StreamContent streamConent = new StreamContent(fs);
            if (file.ToLower().StartsWith("http://"))//是URL地址，直接传URL
            {
                htPara.Add("ImageFile", file);
            }
            else
            {
                string strFileName = file.Substring(file.LastIndexOf('/') + 1);
                multipartFormDataContent.Add(streamConent, strFileName, strFileName);
            }
           
        }
        //添加参数
        foreach (DictionaryEntry de in htPara)
        {
            ByteArrayContent bacTmp = new ByteArrayContent(Encoding.UTF8.GetBytes(de.Value.ToString()));
            multipartFormDataContent.Add(bacTmp, de.Key.ToString());
        }

        HttpResponseMessage responseMessage = httpClient.PostAsync(server, multipartFormDataContent).Result;
        if(fs!=null)
        {
            fs.Close();
            fs.Dispose();
            fs = null;
        }
        if (responseMessage.IsSuccessStatusCode)
        {
            string strCC = responseMessage.Content.ReadAsStringAsync().Result;
            return strCC;
        }
        return responseMessage.ToString();
    }
    catch (Exception ex)
    {

        return ex.Message;
    }
}
```

第一阶段：

```c#
string HttpUploadFile(string url, string file, Dictionary<string, string> parameters)
{
    var httpClient = new HttpClient();

    var multipartFormDataContent = new MultipartFormDataContent();
    FileStream fs = null;
    if (!String.IsNullOrWhiteSpace(file))
    {
        if (file.StartsWith("http://", StringComparison.OrdinalIgnoreCase) || file.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
            parameters.Add("ImageFile", file);
        else
        {
            if (File.Exists(file))
            {
                var fileName = Path.GetFileName(file);
                fs = new FileStream(file, FileMode.Open, FileAccess.Read, FileShare.Read);
                multipartFormDataContent.Add(new StreamContent(fs), fileName, fileName);
            }
        }
    }

    foreach (var item in parameters)
        multipartFormDataContent.Add(new StringContent(item.Value), item.Key);

    try
    {
        var responseMessage = httpClient.PostAsync(url, multipartFormDataContent).Result;

        return responseMessage.IsSuccessStatusCode ? responseMessage.Content.ReadAsStringAsync().Result : null;
    }
    catch (Exception)
    {
        return null;
    }
    finally
    {
        if (fs != null)
        {
            fs.Close();
            fs.Dispose();
        }
    }
}
```

第二阶段：