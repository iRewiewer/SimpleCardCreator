using Newtonsoft.Json;
using System.Drawing.Imaging;

namespace SimpleCardCreator
{
	public partial class MainApp : Form
	{
		public MainApp()
		{
			InitializeComponent();
		}

		private void App_Load(object sender, EventArgs e)
		{

		}

		private void cardNameValue_TextChanged(object sender, EventArgs e)
		{
			cardName.Text = cardNameValue.Text;
		}

		private void cardTypeValue_TextChanged(object sender, EventArgs e)
		{
			cardType.Text = cardTypeValue.Text;
		}

		private void cardDescriptionValue_TextChanged(object sender, EventArgs e)
		{
			cardDescription.Text = cardDescriptionValue.Text;
		}

		private void cardDefenseValue_TextChanged(object sender, EventArgs e)
		{
			cardDefense.Text = cardDefenseValue.Text;
		}

		private void cardAttackValue_TextChanged(object sender, EventArgs e)
		{
			cardAttack.Text = cardAttackValue.Text;
		}

		private void openImage_Click(object sender, EventArgs e)
		{
			if (openData.ShowDialog() == DialogResult.OK)
			{
				cardPreview.Image = Image.FromFile(openData.FileName);
			}

		}

		private void saveCard_Click(object? sender, EventArgs? e)
		{
			string filename = $"{cardName.Text.ToLower().Replace(" ", "_")}.png";
			string location = Path.Combine(Environment.CurrentDirectory, "cards");
			
			if(!Directory.Exists(location))
			{
				Directory.CreateDirectory(location);
			}

			location = Path.Combine(location, cardType.Text);

			if (!Directory.Exists(location))
			{
				Directory.CreateDirectory(location);
			}

			string savePath = Path.Combine(location, filename);

			Bitmap bmpScreenshot = new Bitmap(cardPreview.Width, cardPreview.Height, PixelFormat.Format32bppArgb);
			Graphics gfxScreenshot = Graphics.FromImage(bmpScreenshot);
			Point coords = cardPreview.PointToScreen(Point.Empty);
			gfxScreenshot.CopyFromScreen(coords.X, coords.Y, 0, 0, Screen.PrimaryScreen.Bounds.Size, CopyPixelOperation.SourceCopy);
			bmpScreenshot.Save(savePath, ImageFormat.Png);

			bmpScreenshot.Dispose();
			gfxScreenshot.Dispose();
		}

		private void importCardsFromJSON_Click(object sender, EventArgs e)
		{
			string filepath = Path.Combine(Environment.CurrentDirectory, "cards.json");

			List<Card> cards = new List<Card>();
			if (File.Exists(filepath))
			{
				cards = JsonConvert.DeserializeObject<List<Card>>(File.ReadAllText(filepath));
			}
			else
			{
				MessageBox.Show("Error: 'cards.json' not found in app directory.");
			}

			foreach(Card card in cards)
			{
				if (File.Exists(card.imagePath))
				{
					using (Image image = Image.FromFile(card.imagePath))
					{
						cardPreview.Image = image;
						cardPreview.Refresh();
					}
				}

				cardName.Text = card.name;
				cardType.Text = card.type;
				cardAttack.Text = card.ATK.ToString();
				cardDefense.Text = card.DEF.ToString();
				cardDescription.Text = card.description;

				if (card.type == "Raid Boss")
				{
					cardAttack.Hide(); 
					cardDefense.Size = new Size(333, 24);
					cardDefense.Location = new Point(12, 426);
				}
				else
				{
					cardAttack.Show();
					cardDefense.Size = new Size(87, 24);
					cardDefense.Location = new Point(258, 426);
				}

				cardName.Refresh();
				cardType.Refresh();
				cardAttack.Refresh();
				cardDefense.Refresh();
				cardDescription.Refresh();

				saveCard_Click(null, null);

				Thread.Sleep(1000);
			}
		}
	}

	public class Card
	{
		[JsonProperty("id")] public int id;
		[JsonProperty("ATK")] public int ATK;
		[JsonProperty("DEF")] public int DEF;
		[JsonProperty("name")] public string name;
		[JsonProperty("type")] public string type;
		[JsonProperty("description")] public string description;
		[JsonProperty("imagePath")] public string imagePath;
	}
}
