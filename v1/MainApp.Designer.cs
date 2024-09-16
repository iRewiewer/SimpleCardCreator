namespace SimpleCardCreator
{
	partial class MainApp
	{
		/// <summary>
		///  Required designer variable.
		/// </summary>
		private System.ComponentModel.IContainer components = null;

		/// <summary>
		///  Clean up any resources being used.
		/// </summary>
		/// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
		protected override void Dispose(bool disposing)
		{
			if (disposing && (components != null))
			{
				components.Dispose();
			}
			base.Dispose(disposing);
		}

		#region Windows Form Designer generated code

		/// <summary>
		///  Required method for Designer support - do not modify
		///  the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent()
		{
			components = new System.ComponentModel.Container();
			System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MainApp));
			cardPreview = new PictureBox();
			lb1 = new Label();
			openData = new OpenFileDialog();
			saveData = new SaveFileDialog();
			cardDescription = new RichTextBox();
			cardDefense = new RichTextBox();
			cardType = new RichTextBox();
			cardName = new RichTextBox();
			saveCard = new Button();
			openOverlay = new Button();
			openImage = new Button();
			lb8 = new Label();
			lb7 = new Label();
			lb6 = new Label();
			cardDefenseValue = new RichTextBox();
			lb5 = new Label();
			cardAttackValue = new RichTextBox();
			lb4 = new Label();
			cardDescriptionValue = new RichTextBox();
			lb3 = new Label();
			cardTypeValue = new RichTextBox();
			lb2 = new Label();
			cardNameValue = new RichTextBox();
			importCardsFromJSON = new Button();
			cardAttack = new RichTextBox();
			timer1 = new System.Windows.Forms.Timer(components);
			((System.ComponentModel.ISupportInitialize)cardPreview).BeginInit();
			SuspendLayout();
			// 
			// cardPreview
			// 
			cardPreview.Image = (Image)resources.GetObject("cardPreview.Image");
			cardPreview.Location = new Point(8, 28);
			cardPreview.Name = "cardPreview";
			cardPreview.Size = new Size(347, 526);
			cardPreview.SizeMode = PictureBoxSizeMode.StretchImage;
			cardPreview.TabIndex = 0;
			cardPreview.TabStop = false;
			// 
			// lb1
			// 
			lb1.AutoSize = true;
			lb1.Location = new Point(6, 8);
			lb1.Name = "lb1";
			lb1.Size = new Size(86, 17);
			lb1.TabIndex = 1;
			lb1.Text = "Current Card:";
			// 
			// openData
			// 
			openData.FileName = "openData";
			// 
			// saveData
			// 
			saveData.FileName = "saveData";
			// 
			// cardDescription
			// 
			cardDescription.BackColor = Color.Maroon;
			cardDescription.BorderStyle = BorderStyle.None;
			cardDescription.Font = new Font("Consolas", 9.75F, FontStyle.Regular, GraphicsUnit.Point, 0);
			cardDescription.ForeColor = Color.White;
			cardDescription.Location = new Point(8, 456);
			cardDescription.Name = "cardDescription";
			cardDescription.ReadOnly = true;
			cardDescription.ScrollBars = RichTextBoxScrollBars.None;
			cardDescription.Size = new Size(347, 97);
			cardDescription.TabIndex = 20;
			cardDescription.Text = "Deals 1 damage to all units every turn.\n75% Health: Increased damage to 2 per turn.\n50% Health: Gains 10 damage absorption shield.\n25% Health: Instantly destroys every unit on the field.";
			// 
			// cardDefense
			// 
			cardDefense.BackColor = Color.LightCoral;
			cardDefense.BorderStyle = BorderStyle.None;
			cardDefense.Font = new Font("Courier New", 15.75F, FontStyle.Regular, GraphicsUnit.Point, 0);
			cardDefense.ForeColor = Color.White;
			cardDefense.Location = new Point(258, 426);
			cardDefense.Name = "cardDefense";
			cardDefense.ReadOnly = true;
			cardDefense.ScrollBars = RichTextBoxScrollBars.None;
			cardDefense.Size = new Size(87, 24);
			cardDefense.TabIndex = 21;
			cardDefense.Text = "50 DEF";
			cardDefense.WordWrap = false;
			// 
			// cardType
			// 
			cardType.BackColor = Color.Maroon;
			cardType.BorderStyle = BorderStyle.None;
			cardType.Font = new Font("Courier New", 15.75F, FontStyle.Regular, GraphicsUnit.Point, 0);
			cardType.ForeColor = Color.White;
			cardType.Location = new Point(121, 74);
			cardType.Name = "cardType";
			cardType.ReadOnly = true;
			cardType.Size = new Size(125, 25);
			cardType.TabIndex = 19;
			cardType.Text = "Raid Boss";
			cardType.WordWrap = false;
			// 
			// cardName
			// 
			cardName.BackColor = Color.RosyBrown;
			cardName.BorderStyle = BorderStyle.None;
			cardName.Font = new Font("Century Gothic", 15.75F, FontStyle.Regular, GraphicsUnit.Point, 0);
			cardName.ForeColor = Color.White;
			cardName.Location = new Point(20, 40);
			cardName.Name = "cardName";
			cardName.ReadOnly = true;
			cardName.Size = new Size(325, 29);
			cardName.TabIndex = 18;
			cardName.Text = "Ishi Yakura, The Demonic Ronin";
			cardName.WordWrap = false;
			// 
			// saveCard
			// 
			saveCard.Location = new Point(408, 456);
			saveCard.Name = "saveCard";
			saveCard.Size = new Size(176, 35);
			saveCard.TabIndex = 22;
			saveCard.Text = "Save Card";
			saveCard.UseVisualStyleBackColor = true;
			saveCard.Click += saveCard_Click;
			// 
			// openOverlay
			// 
			openOverlay.Location = new Point(509, 414);
			openOverlay.Name = "openOverlay";
			openOverlay.Size = new Size(75, 23);
			openOverlay.TabIndex = 15;
			openOverlay.Text = "Select";
			openOverlay.UseVisualStyleBackColor = true;
			// 
			// openImage
			// 
			openImage.Location = new Point(408, 414);
			openImage.Name = "openImage";
			openImage.Size = new Size(75, 23);
			openImage.TabIndex = 14;
			openImage.Text = "Select";
			openImage.UseVisualStyleBackColor = true;
			openImage.Click += openImage_Click;
			// 
			// lb8
			// 
			lb8.AutoSize = true;
			lb8.Location = new Point(509, 394);
			lb8.Name = "lb8";
			lb8.Size = new Size(87, 17);
			lb8.TabIndex = 13;
			lb8.Text = "Card Overlay:";
			// 
			// lb7
			// 
			lb7.AutoSize = true;
			lb7.Location = new Point(408, 394);
			lb7.Name = "lb7";
			lb7.Size = new Size(79, 17);
			lb7.TabIndex = 12;
			lb7.Text = "Card Image:";
			// 
			// lb6
			// 
			lb6.AutoSize = true;
			lb6.Location = new Point(378, 326);
			lb6.Name = "lb6";
			lb6.Size = new Size(58, 17);
			lb6.TabIndex = 11;
			lb6.Text = "Defense:";
			// 
			// cardDefenseValue
			// 
			cardDefenseValue.Location = new Point(378, 346);
			cardDefenseValue.Name = "cardDefenseValue";
			cardDefenseValue.Size = new Size(242, 29);
			cardDefenseValue.TabIndex = 10;
			cardDefenseValue.Text = "";
			cardDefenseValue.TextChanged += cardDefenseValue_TextChanged;
			// 
			// lb5
			// 
			lb5.AutoSize = true;
			lb5.Location = new Point(378, 258);
			lb5.Name = "lb5";
			lb5.Size = new Size(46, 17);
			lb5.TabIndex = 9;
			lb5.Text = "Attack:";
			// 
			// cardAttackValue
			// 
			cardAttackValue.Location = new Point(378, 278);
			cardAttackValue.Name = "cardAttackValue";
			cardAttackValue.Size = new Size(242, 29);
			cardAttackValue.TabIndex = 8;
			cardAttackValue.Text = "";
			cardAttackValue.TextChanged += cardAttackValue_TextChanged;
			// 
			// lb4
			// 
			lb4.AutoSize = true;
			lb4.Location = new Point(378, 192);
			lb4.Name = "lb4";
			lb4.Size = new Size(109, 17);
			lb4.TabIndex = 7;
			lb4.Text = "Card Description:";
			// 
			// cardDescriptionValue
			// 
			cardDescriptionValue.Location = new Point(378, 212);
			cardDescriptionValue.Name = "cardDescriptionValue";
			cardDescriptionValue.Size = new Size(242, 29);
			cardDescriptionValue.TabIndex = 6;
			cardDescriptionValue.Text = "";
			cardDescriptionValue.TextChanged += cardDescriptionValue_TextChanged;
			// 
			// lb3
			// 
			lb3.AutoSize = true;
			lb3.Location = new Point(378, 129);
			lb3.Name = "lb3";
			lb3.Size = new Size(70, 17);
			lb3.TabIndex = 5;
			lb3.Text = "Card Type:";
			// 
			// cardTypeValue
			// 
			cardTypeValue.Location = new Point(378, 149);
			cardTypeValue.Name = "cardTypeValue";
			cardTypeValue.Size = new Size(242, 29);
			cardTypeValue.TabIndex = 4;
			cardTypeValue.Text = "";
			cardTypeValue.TextChanged += cardTypeValue_TextChanged;
			// 
			// lb2
			// 
			lb2.AutoSize = true;
			lb2.Location = new Point(378, 71);
			lb2.Name = "lb2";
			lb2.Size = new Size(78, 17);
			lb2.TabIndex = 3;
			lb2.Text = "Card Name:";
			// 
			// cardNameValue
			// 
			cardNameValue.Location = new Point(378, 91);
			cardNameValue.Name = "cardNameValue";
			cardNameValue.Size = new Size(242, 29);
			cardNameValue.TabIndex = 2;
			cardNameValue.Text = "";
			cardNameValue.TextChanged += cardNameValue_TextChanged;
			// 
			// importCardsFromJSON
			// 
			importCardsFromJSON.Location = new Point(408, 12);
			importCardsFromJSON.Name = "importCardsFromJSON";
			importCardsFromJSON.Size = new Size(188, 35);
			importCardsFromJSON.TabIndex = 23;
			importCardsFromJSON.Text = "Import Cards from JSON";
			importCardsFromJSON.UseVisualStyleBackColor = true;
			importCardsFromJSON.Click += importCardsFromJSON_Click;
			// 
			// cardAttack
			// 
			cardAttack.BackColor = Color.LightCoral;
			cardAttack.BorderStyle = BorderStyle.None;
			cardAttack.Font = new Font("Courier New", 15.75F, FontStyle.Regular, GraphicsUnit.Point, 0);
			cardAttack.ForeColor = Color.White;
			cardAttack.Location = new Point(12, 426);
			cardAttack.Name = "cardAttack";
			cardAttack.ReadOnly = true;
			cardAttack.ScrollBars = RichTextBoxScrollBars.None;
			cardAttack.Size = new Size(87, 24);
			cardAttack.TabIndex = 24;
			cardAttack.Text = "50 ATK";
			cardAttack.WordWrap = false;
			// 
			// MainApp
			// 
			AutoScaleDimensions = new SizeF(7F, 17F);
			AutoScaleMode = AutoScaleMode.Font;
			ClientSize = new Size(634, 562);
			Controls.Add(cardAttack);
			Controls.Add(importCardsFromJSON);
			Controls.Add(cardDescription);
			Controls.Add(cardDefense);
			Controls.Add(cardType);
			Controls.Add(lb1);
			Controls.Add(cardName);
			Controls.Add(cardNameValue);
			Controls.Add(saveCard);
			Controls.Add(lb2);
			Controls.Add(openOverlay);
			Controls.Add(cardTypeValue);
			Controls.Add(openImage);
			Controls.Add(lb3);
			Controls.Add(lb8);
			Controls.Add(cardDescriptionValue);
			Controls.Add(lb7);
			Controls.Add(lb4);
			Controls.Add(lb6);
			Controls.Add(cardAttackValue);
			Controls.Add(cardDefenseValue);
			Controls.Add(lb5);
			Controls.Add(cardPreview);
			Name = "MainApp";
			Text = "SimpleCardCreator";
			Load += App_Load;
			((System.ComponentModel.ISupportInitialize)cardPreview).EndInit();
			ResumeLayout(false);
			PerformLayout();
		}

		#endregion

		private PictureBox cardPreview;
		private Label lb1;
		private OpenFileDialog openData;
		private SaveFileDialog saveData;
		private Label lb2;
		private RichTextBox cardNameValue;
		private Label lb3;
		private RichTextBox cardTypeValue;
		private Label lb6;
		private RichTextBox cardDefenseValue;
		private Label lb5;
		private RichTextBox cardAttackValue;
		private Label lb4;
		private RichTextBox cardDescriptionValue;
		private Button openImage;
		private Label lb8;
		private Label lb7;
		private Button openOverlay;
		private RichTextBox cardType;
		private RichTextBox cardName;
		private RichTextBox cardDescription;
		private RichTextBox cardDefense;
		private Button saveCard;
		private Button importCardsFromJSON;
		private RichTextBox cardAttack;
		private System.Windows.Forms.Timer timer1;
	}
}
